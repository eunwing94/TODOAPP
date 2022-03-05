const express = require('express'); // 설치한 라이브러리 띄우기 1. express LIB
const app = express();              // 해당 라이브러리 활용 객체 띄우기
const bodyParser = require('body-parser');  // 설치한 라이브러리 띄우기 2. body-parser LIB - request 데이터 파싱해서 request.body.title 읽어올 수 있게
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient; // 설치한 라이브러리 띄우기 3. mongoDB LIB
MongoClient.connect('mongodb+srv://admin:<1q2w3e4r!@#$>@cluster0.5txhu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(error, client){

    app.listen(8080,function(){
        console.log('listening on 8080');
    });
    
});



app.get('/pet', function(request, response){
    response.send('This is a website for shopping pet items');
});


app.get('/beauty', function(request, response){
    var html = 'This is HOMEWORK #1. This is a website for shopping BEAUTY items';
    response.send(html); //변경 여부  ㅇㅇ
    
});

// slash 하나는 홈페이지
app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
    
});


app.get('/write', function(request, response){
    response.sendFile(__dirname + '/write.html');
    
});


app.post('/add', function(request, response){
    response.send('전송완료!');
    console.log(request.body.title);
    console.log(request.body.date);


});