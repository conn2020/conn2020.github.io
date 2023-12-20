# Application(一)
```javascript
// package.json
"require": "./lib/application.js",
// application.js
const Emitter = require('events');
module.exports = class Application extends Emitter...
// events
export = EventEmitter;
```
从koa的npm包里可以看到koa的入口文件是 application.js,该文件export抛出了一个继承自Emitter的类。从events的源码里可以看到Emitter其实就是EventEmitter。所以koa具备EventEmitter的能力，那么EventEmitter具备什么能力呢
## EventEmitter
nodejs中大多数API都是基于异步事件驱动的架构，而所有具备emit events能力的对象都是EventEmitter的实例，EventEmitter为我们提供了事件订阅机制。在nodejs的官网上有关于EventEmitter的介绍，包括on、addListener等方法。在编码过程中，我们发现同一eventName的监听可以有多个，并且顺序执行，那么内部是怎么实现的呢？listener可以有多个，那么这个数量有限制么？带着这些问题，我们可以看下EventEmitter的源码
  
[on](https://github.com/nodejs/node/blob/main/lib/events.js)

[fixed_queue](https://github.com/nodejs/node/blob/main/lib/internal/fixed_queue.js)
  
```javascript
// on function
const unconsumedEvents = new FixedQueue();
const unconsumedPromises = new FixedQueue();
// FixedQueue又是什么呢

// fixed_queue.js FixedCircularBuffer 单向链表
// Currently optimal queue size, tested on V8 6.0 - 6.6. Must be power of two.
const kSize = 2048;
this.list = new Array(kSize); // 这个数量限制我们也看到了
```
