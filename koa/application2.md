# Application(二)
```javascript
/**
 * 在Application的源码中我们看到了listen方法
 * 平时的使用 const app = new Koa() app.listen(端口号, 回调函数)
 * 逻辑上看 callback 比较关键
 */
listen (...args) {
    debug('listen')
    const server = http.createServer(this.callback())
    return server.listen(...args)
}
```
## callback做了什么
```javascript
callback () {
    const fn = this.compose(this.middleware)

    if (!this.listenerCount('error')) this.on('error', this.onerror)

    const handleRequest = (req, res) => {
        const ctx = this.createContext(req, res)
        if (!this.ctxStorage) {
            return this.handleRequest(ctx, fn)
        }
        return this.ctxStorage.run(ctx, async () => {
            return await this.handleRequest(ctx, fn)
        })
    }

    return handleRequest
}
```
可以看到callback()返回了一个函数，该函数作为参数传到了http.createServer中，至于http.createServer的逻辑后续再看，callback的内部逻辑
*  处理middleware中间件(compose)
*  将ttp.createServer的req和res作为参数传递到handleRequest方法中
*  createContext()中context增加了两个子对象request和response，**这样我们之前看到的代理模式也就起作用了**
*  返回一个函数，该函数主要逻辑是Application类中的 handleRequest
## compose做了什么
```javascript
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
通过源码可以看出其主要功能
* 返回一个函数
* 这个函数在被调用的时候，会有context, next两个参数
* 正常情况下 返回 Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
* 可以理解成，在线程不忙的时候就递归顺序执行middleware数组中的函数(一律转成异步)，context为中间件函数的参数，也就是我们在使用app.use的时候总是能拿到ctx的原因
* 这个顺序执行也保证了洋葱圈模型的实现

**为什么不直接来个for循环调用middleware中的方法呢？**
  
洋葱卷模型要保证中间件的顺序执行，而中间件可能同步也可能异步，这种情况下for循环是无法做到顺序执行的，而compose将中间件全部转为异步，并递归执行，可以保证洋葱圈模型。
## Promise.resolve()做了什么
* Promise是ES6的内置对象，为解决回调地狱而生
* resolve是Pronmise的静态方法，可以将给定的值转换为Promise