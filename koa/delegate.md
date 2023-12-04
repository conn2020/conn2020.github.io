# 代理模式
在context的源码中，可以看到以下代码
```javascript
delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('has')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .access('accept')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
```
这两段代码的意义是什么呢，目的是让context能够通过key直接访问request[key]和response[key]。这让我们在开发中可以方便的用ctx.[...]去快捷的访问我们需要的属性。
## 一、delegate 如何实现呢？
delegates源码并不复杂，可以通过某个功能一探究竟
```javascript
function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

Delegator.prototype.getter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  // 核心功能
  proto.__defineGetter__(name, function(){
    return this[target][name];
  });

  // 方便链式调用
  return this;
};
// 其他方法的核心功能
// setter
proto.__defineSetter__(name, function(val){
  return this[target][name] = val;
});
// access = getter + setter
this.getter(name).setter(name);
// method
proto[name] = function(){
  // 这里的apply可以省略么？ return this[target][name](arguments)
  // 实际上this[target][name]()的调用，相当于 request[key]()或者 response[key]()
  // 这种方法的调用需要this指向request或者response
  // 如果没有apply，this指向了proto，会出问题，因为proto不是request也不response
  return this[target][name].apply(this[target], arguments);
};
// fluent
// 相当于 [name]() 既有getter能力也有setter能力, 传参为setter，无参为getter
proto[name] = function(val){
  if ('undefined' != typeof val) {
    this[target][name] = val;
    return this;
  } else {
    return this[target][name];
  }
};
```
## 二、代理模式的应用
比如开发一个埋点工具类
```javascript
const AnalysisSDK =  {
  // 存储访问路径
  location: {
    url: '',
    setUrl: function(url) {
      this.url = url
    }
  },
  // 存储用户信息
  user: {
    userId: '',
    setUserId: function(userId) {
      this.userId = userId
    }
  }
}
// 如果没有代理，需要这样调用 缺点：调用链太长，不够优雅
AnalysisSDK.location.setUrl(...)
AnalysisSDK.user.setUserId(...)
// 采用代理模式 逻辑封装在子对象里，好维护，调用代理给跟类，方便调用
AnalysisSDK.setUrl(...)
AnalysisSDK.setUserId(...)
```