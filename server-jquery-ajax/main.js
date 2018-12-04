let myButton = document.querySelector('#myButton');

function success(s) {
    console.log(s);
    console.log(typeof s);
    console.log(s.note.to);
    console.log(s.note.from);
    console.log(s.note.heading);
    console.log(s.note.body);
};
function fail(f) {
    console.log(f);
    console.log(f.status);
    console.log(f.responseText);
};

myButton.addEventListener('click', function (event) {
    $.ajax({ //$.ajax调用{}内的函数会返回一个promise
        method: 'GET',
        url: '/lvbin.com',
    }).then(success,fail); //成功的话就调用success函数，失败的话就调用fail函数
})