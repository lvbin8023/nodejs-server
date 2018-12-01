# nodejs-server
- 一个简易的付款服务器搭建使用，index.js。

JSONP

请求方：lvbin.com的前端程序员（浏览器）

响应方：jack.com的后端程序员（服务器）

1、请求方创建script，src指向响应方，同时传一个查询参数  ?callbackName=xxx。

2、响应方根据查询参数callbackName，构造形如：

​      1、xxx.call(undefined,'你要的数据') 

​      2、xxx('你要的数据')

这样的响应

3、浏览器接收到响应，就会执行xxx.call(undefined,'你要的数据') 

4、那么请求方就知道了它要的数据

这就是 JSONP

利用script标签没有跨越限制的特性来达到与第三方通讯的目的。当需要通讯时，本站会动态创建一个script元素（注意使用完后及时删除），地址指向第三方的API网址，形如下面的代码：

```javascript
<script src="http://lvbin.com:8002/pay?callbackName=xxx"></script>
```

并提供一个回调函数来接收数据（函数名可约定，或通过地址参数传递）。第三方产生的响应为json数据的包装（故称为jsonp，即json padding），形如：

```javascript
callbackName.call(undefined,{'success':true,'message':1});
```

这样浏览器会调用callback函数，并传递解析后的json对象作为参数。本站脚本可以在callback函数里处理所传入的数据。

约定：

1、callbackName --> callback

2、xxx  --> 随机数  lvbin123123，不是数字开头的



如果是使用jquery的话：

1、引入jquery

2、代码如下：

```javascript
$.ajax({ // 和ajax没有任何关系，只是名字。
    url: 'http://jack.com:8002/pay',
    dataType: 'jsonp',
    success: function () {
        if (response === 'success') {
            amount.innerText -= 1;
        }
    }
})
```

