let myButton = document.querySelector('#myButton');
myButton.addEventListener('click', function () {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function (event) {
        if (event.currentTarget.readyState === 4) {
            console.log('请求响应都已经完毕了');
            if (event.currentTarget.status >= 200 && event.currentTarget.status < 300) {
                console.log('请求成功');
                let parse = new DOMParser(); // 解析器
                let xmlDoc = parse.parseFromString(event.currentTarget.responseText, 'text/xml');
                let title = xmlDoc.getElementsByTagName('body')[0].textContent;
                console.log(title);
            } else if (event.currentTarget.status >= 400) {
                console.log('请求失败');
            }
        }
    };
    request.open('GET', '/xxx'); // 配置初始化request
    request.send(); // 发送请求
})