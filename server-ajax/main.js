let myButton = document.querySelector('#myButton');
myButton.addEventListener('click', function () {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://jack.com:8002/xxx'); // 配置初始化request
    request.send(); // 发送请求
    request.onreadystatechange = function (event) {
        if (event.currentTarget.readyState === 4) {
            console.log('请求响应都已经完毕了');
            if (event.currentTarget.status >= 200 && event.currentTarget.status < 300) {
                console.log('请求成功');
                console.log(typeof event.currentTarget.responseText);
                console.log(event.currentTarget.responseText);
                let string = event.currentTarget.responseText;
                // 把符合JSON语法的字符串转换为js对应的值
                // JSON.parse是浏览器提供的
                let object = window.JSON.parse(string);
                console.log(typeof object);
                console.log(object);
                console.log(object.note.to);
                console.log(object.note.from);
                console.log(object.note.body);
            } else if (event.currentTarget.status >= 400) {
                console.log('请求失败');
            }
        }
    };
})