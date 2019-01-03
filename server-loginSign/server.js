const http = require('http');
const fs = require('fs');
const url = require('url');
const port = process.argv[2];

if (!port) {
    console.log('请指定端口号:\nnode server.js 8888 类似于上面的格式');
    process.exit(1);
}

let sessions = {};

let server = http.createServer(function (request, response) {
    let parsedUrl = url.parse(request.url, true);
    let pathWithQuery = request.url;
    let queryString = '';
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'));
    }
    let path = parsedUrl.pathname;
    let query = parsedUrl.query;
    let method = request.method;

    console.log('您好，含查询字符串的路径是：\n' + pathWithQuery);

    if (path === '/') {
        let string = fs.readFileSync('./index.html', 'utf8');
        let cookies = '';
        if (request.headers.cookie) {
            cookies = request.headers.cookie.split('; ');
        }
        let hash = {};
        for (let i = 0; i < cookies.length; i++) {
            let parts = cookies[i].split('=');
            let key = parts[0];
            let value = parts[1];
            hash[key] = value;
        }
        let mySessions = sessions[hash.sessionId];
        let email;
        if (mySessions) {
            email = mySessions.sign_in_email;
        }
        let users = fs.readFileSync('./db/users', 'utf8');
        users = JSON.parse(users);
        let foundUsers;
        for (let j = 0; j < users.length; j++) {
            if (users[j].email === email) {
                foundUsers = users[j];
                break;
            }
        }
        if (foundUsers) {
            string = string.replace('__password__', foundUsers.password);
        } else {
            string = string.replace('__password__', '不知道');
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/sign_up' && method === 'GET') {
        let string = fs.readFileSync('./sign_up.html', 'utf8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/sign_up' && method === 'POST') {
        readBody(request).then(function (body) {
            let hash = [];
            let strings = body.split('&'); // ['email=1', 'password=2', 'password_confirmation=2']
            strings.forEach(function (string) {
                let parts = string.split('=');
                let key = parts[0];
                let value = parts[1];
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
                let users = fs.readFileSync('./db/users', 'utf8');
                try {
                    users = JSON.parse(users);
                } catch (exception) {
                    users = [];
                }
                let inUse = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === email) {
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
                    let usersString = JSON.stringify(users);
                    fs.writeFileSync('./db/users', usersString);
                    response.statusCode = 200;
                }
            }
            response.end();
        });
    } else if (path === '/sign_in' && method === 'GET') {
        let string = fs.readFileSync('./sign_in.html', 'utf8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(string);
        response.end();
    } else if (path === '/sign_in' && method === 'POST') { //登录
        readBody(request).then(function (body) {
            let hash = [];
            let strings = body.split('&'); // ['email=1', 'password=2', 'password_confirmation=2']
            strings.forEach(function (string) {
                let parts = string.split('=');
                let key = parts[0];
                let value = parts[1];
                hash[key] = decodeURIComponent(value);
            });
            let {
                email,
                password
            } = hash;
            let users = fs.readFileSync('./db/users', 'utf8');
            try {
                users = JSON.parse(users);
            } catch (exception) {
                users = [];
            }
            let found = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].password === password) {
                    found = true;
                    break;
                }
            }
            if (found) {
                let sessionId = parseInt(Math.random() * 1000000); //随机数sessionId
                sessions[sessionId] = {sign_in_email: email};
                response.setHeader('Set-Cookie', `sessionId=${sessionId}`);
                response.statusCode = 200;
            } else {
                response.statusCode = 401;
            }
            response.end();
        });
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
        let body = [];
        request.on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {
            body = Buffer.concat(body).toString();
            resolve(body);
        });
    });
}

server.listen(port);
console.log('监听端口' + port + ' 成功\n请用浏览器打开 http://localhost:' + port);