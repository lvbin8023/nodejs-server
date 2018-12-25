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

    console.log('您好，含查询字符串的路径是：\n' + pathWithQuery);

    if (path === '/') {
        var string = fs.readFileSync('./index.html', 'utf-8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/sign_up' && method === 'GET') {
        var string = fs.readFileSync('./sign_up.html', 'utf-8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/sign_up' && method === 'POST') {
        readBody(request).then(function (body) {
            var hash = [];
            var strings = body.split('&'); // ['email=1', 'password=2', 'password_confirmation=3']
            strings.forEach(function (string) {
                var parts = string.split('=');
                var key = parts[0];
                var value = parts[1];
                hash[key] = decodeURIComponent(value);
            });
            let {
                email,
                password,
                password_confirmation
            } = hash;
            if (email.indexOf('@') === -1) {
                response.statusCode = 400;
                response.setHeader('Content-Type', 'text/json;charset=utf-8');
                response.write(`{
                    "errors":{
                        "email":"invalid"
                    }
                }`);
            } else if (password !== password_confirmation) {
                response.statusCode = 400;
                response.write('password not match');
            } else {
                var users = fs.readFileSync('./db/users', 'utf-8');
                try {
                    users = JSON.parse(users);
                } catch (exception) {
                    users = [];
                }
                var inUse = false;
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    if (user.email === email) {
                        inUse = true;
                        break;
                    }
                }
                if (inUse) {
                    response.statusCode = 400;
                    response.write('email in use');
                } else {
                    users.push({
                        email: email,
                        password: password
                    });
                    var usersString = JSON.stringify(users);
                    fs.writeFileSync('./db/users', usersString);
                    response.statusCode = 200;
                }
            }
            response.end();
        });
    } else if (path === '/main.js') {
        var string = fs.readFileSync('./main.js', 'utf-8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/xxx') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/json;charset=utf-8');
        response.setHeader('Access-Control-Allow-Origin', 'http://lvbin.com:8001'); // CORS跨域
        response.write(`
        {
            "note":{
                "to":"魏春杰",
                "from":"吕彬",
                "heading":"打招呼",
                "body":"好久不见！"
            }
        }
        `); // 返回的永远是字符串
        response.end();
    } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(`{
            "error":"not found"
        }
        `);
        response.end();
    }
});

// 封装获取body数据的函数
function readBody(request) {
    return new Promise(function (resolve, reject) {
        var body = [];
        request.on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {
            body = Buffer.concat(body).toString();
            resolve(body);
        });
    });
}

server.listen(port);
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);