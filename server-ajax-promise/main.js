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
window.$ = window.jQuery;
window.$.ajax = function (options) {
    // 返回一个promise
    return new Promise(function (resolve, reject) {
        let url;
        if (arguments.length === 1) {
            url = options.url;
        } else if (arguments.length === 2) {
            url = arguments[0];
            options = arguments[1];
        }
        let method = options.method;
        let headers = options.headers;
        let body = options.body;

        let request = new XMLHttpRequest();
        request.open(method, url); // 配置初始化request
        for (let key in headers) {
            let value = headers[key];
            request.setRequestHeader(key, value);
        }
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    resolve.call(undefined, request.responseText);
                } else if (request.status >= 400) {
                    reject.call(undefined, request);
                }
            }
        };
        request.send(body); // 发送请求,设置请求体
    });
}

myButton.addEventListener('click', function (event) {
    window.$.ajax({
        method: 'GET',
        url: '/xxx',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'lvbin': 18
        },
        body: 'a=1&&b=2'
    }).then(
        (responseText) => {
            console.log(responseText);
        },
        (request) => {
            console.log(request);
        });
})