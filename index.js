var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.argv[2];

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？');
    process.exit(1);
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true);
    var pathWithQuery = request.url;
    var queryString = '';
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'));
    }
    var path = parsedUrl.pathname;
    var query = parsedUrl.query;
    var method = request.method;

    /******** 从这里开始看，上面不要看 ************/

    console.log('您好：含查询字符串的路径是：\n' + pathWithQuery);

    if (path === '/') { // 如果用户请求的是 / 路径
        var string = fs.readFileSync('./index.html', 'utf8');
        var amount = fs.readFileSync('./sql', 'utf8'); // 当前数据库的数据是100
        string = string.replace('$$amount$$', amount);
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/style.css') {
        var string = fs.readFileSync('./style.css', 'utf8');
        response.setHeader('Content-Type', 'text/css');
        response.write(string);
        response.end();
    } else if (path === '/main.js') {
        var string = fs.readFileSync('./main.js', 'utf8');
        response.setHeader('Content-Type', 'application/javascript');
        response.write(string);
        response.end();
    } else if (path === '/pay' && method.toUpperCase() === 'POST') {
        var amount = fs.readFileSync('./sql', 'utf8'); // 当前数据库的数据是100
        var newAmount = amount - 1;
        fs.writeFileSync('./sql',newAmount,'utf8'); // 存入数据库
        response.setHeader('Content-Type', 'text/json;charset=utf-8');
        response.write('付款成功，您的余额是：'+newAmount);
        response.end();
    } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write('找不到对应的路径，你需要自行修改index.js');
        response.end();
    }
    console.log(method + '' + request.url);
})

server.listen(port);
console.log('监听' + port + '成功，请打开 http://localhost:' + port);