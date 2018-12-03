let myButton = document.querySelector('#myButton');
// myButton.addEventListener('click', function () {
//     let request = new XMLHttpRequest();
//     request.open('POST', '/xxx'); // 配置初始化request
//     request.setRequestHeader('lvbin', '18');
//     request.setRequestHeader('Content-Type', 'x-www-form-urlencoded');
//     request.send('设置第四部分请求体'); // 发送请求,设置请求体
//     request.onreadystatechange = function (event) {
//         if (request.readyState === 4) {
//             console.log('请求响应都已经完毕了');
//             if (request.status >= 200 && request.status < 300) {
//                 console.log('请求成功');
//                 console.log(request.getAllResponseHeaders());
//                 console.log(request.statusText);
//                 console.log(request.getResponseHeader('date'));
//                 let string = request.responseText;
//                 console.log(string);
//                 // 把符合JSON语法的字符串转换为js对应的值
//                 // JSON.parse是浏览器提供的
//                 let object = window.JSON.parse(string);
//                 console.log(object.note.to);
//                 console.log(object.note.from);
//                 console.log(object.note.body);
//             } else if (request.status >= 400) {
//                 console.log('请求失败');
//             }
//         }
//     };
// })

// 封装成jQuery.ajax
window.jQuery = {}; // 命名空间
window.jQuery.ajax = function (options) {

    let method = options.method;
    let url = options.url;
    let headers = options.headers;
    let successFn = options.successFn;
    let failFn = options.failFn;
    let body = options.body;

    let request = new XMLHttpRequest();
    request.open(method, url); // 配置初始化request
    for (let key in headers ) {
        let value = headers[key];
        request.setRequestHeader(key,value);
    }
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300) {
                successFn.call(undefined, request.responseText);
            } else if (request.status >= 400) {
                failFn.call(undefined, request);
            }
        }
    };
    request.send(body); // 发送请求,设置请求体
}

window.$ = window.jQuery;

function f1(responseText) {};

function f2(responseText) {};

myButton.addEventListener('click', function (event) {
    window.$.ajax({
        method: 'GET',
        url: '/lvbin.com',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'lvbin': 18
        },
        successFn: (x) => {
            f1.call(undefined, x);
            f2.call(undefined, x);
        },
        failFn: (y) => {
            console.log(y.status);
            console.log(y.responseText);
        },
        body: 'a=1&&b=2'
    });
})