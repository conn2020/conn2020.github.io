# Object.create--原型式继承
在Koa源码中，我们在application的构造函数中看到以下的代码：
```javascript
constructor {
    ...
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
    ...
}
```
那么Object.create的作用是什么呢？
## 一、Object.create的功能

在MDN的相关描述是：
>**The Object.create() static method creates a new object, using an existing object as the prototype of the newly created object.**
  
总结为两点：
*   创建一个新对象
*   该新对象的prototype为 Object.create(proto, propertiesObject) 的第一个参数 proto
  
在 ECMAScript 规范中这样描述 Object.create 的执行步骤：
```javascript
Object.create ( O, Properties )
1. If O is not an Object and O is not null, throw a TypeError exception.
2. Let obj be OrdinaryObjectCreate(O). // 1、obj = MakeBasicObject() 2、obj.prototypr = O
3. If Properties is not undefined, then Return ObjectDefineProperties(obj, Properties).
4. Return obj.
```
  
在Koa中的应用，可以靠伪代码一探究竟
```javascript
const Context = {
    inspect() {},
    toJSON() {},
    throw () {},
    onerror () {},
    get cookies() {},
    set cookies(_cookies) {}
}

class Application {
    constructor() {
        this.context = Object.create(Context)
        // this.context = context 会怎么样？
        // 这样this.context进行重写属性和方法时，会影响到 Context 对象
        // this.context.__proto__.prop = ... 也会影响到 Context 对象
    }
}

const app = new Application()

console.log(app) // Application { context: {} }
console.log(app.context) // {cookies: undefined, ...}
console.log(app.context.toJSON) // [Function: toJSON]
```
**这样Koa实列可以通过自身属性context访问Context类下的属性和方法**
  
![avatar](/assets/images/002.png)
## 二、Object.create(null) 对比 new Object() 和 {}
后两者均继承自 Object 构造函数，而使用Object.create(null) ，能得到一个没有任何继承痕迹的对象。