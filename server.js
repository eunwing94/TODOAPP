const express = require('express'); // 설치한 라이브러리 띄우기
const app = express();              // 해당 라이브러리 활용 객체 띄우기

app.listen(8080,function(){
    console.log('listening on 8080');
});                       // 서버 띄우기


app.get('/pet', function(request, response){
    response.send('This is a website for shopping pet items');
});


app.get('/beauty', function(request, response){
    var html = 'This is HOMEWORK #1. This is a website for shopping BEAUTY items';
    response.send(html);
    
});