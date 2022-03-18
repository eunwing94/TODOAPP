const express = require('express'); // 설치한 라이브러리 띄우기 1. express LIB - 서버
const app = express();              // 해당 라이브러리 활용 객체 띄우기
const bodyParser = require('body-parser');  // 설치한 라이브러리 띄우기 2. body-parser LIB - request 데이터 파싱해서 request.body.title 읽어올 수 있게
const { request } = require('express');
const { response } = require('express');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient; // 설치한 라이브러리 띄우기 3. mongoDB LIB - mongo DB

app.set('view engine', 'ejs'); // 설치한 라이브러리 띄우기 4. EJS LIB - node.js가 EJS 라이브러리 통해 DB를 읽어 HTML화
app.use('/public', express.static('public'));   // Middleware 역할 : 요청과 응답의 가교역할


var db; // 저장할 db명
MongoClient.connect('mongodb+srv://admin:admin@cluster0.5txhu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(error, client){

    if(error){
        return console.log(error);
    }

    db = client.db('todoapp');  // MongoDB에 만든 DB명 'todoapp' 에 연결하기

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
    response.render(__dirname + '/views/index.ejs'); // 함수를 CALL 하는 위치와 불려오는 화면의 위치의 상대적 차이를 생각할 것
    
});

// /write로 GET 요청 오면 페이지 열어줘
app.get('/write', function(request, response){
    //response.sendFile(__dirname + '/write.ejs');
    response.render(__dirname + '/views/write.ejs'); // 함수를 CALL 하는 위치와 불려오는 화면의 위치의 상대적 차이를 생각할 것
    
});


// /add로 POST 요청 온 데이터 저장
app.post('/add', function(request, response){
    
    // find vs. findOne : 모두 vs 하나만
    db.collection('counter').findOne({name : '게시물갯수'} , function(error,result){
        console.log(result.totalPost);
        console.log(result);

        var totalPostCnt = result.totalPost;    // 지금까지 발생한 총 게시물 갯수!
 
        // count 갯수 셋 하고 나서 저장
        db.collection('post').insertOne({_id : totalPostCnt + 1, 제목:request.body.title, 날짜 : request.body.date}, function(error, result){  // object형 자료인 이름, 나이를 post 라는 Collection에 insert
            console.log('제목 및 날짜 저장 완료>ㅁ<');
        
            // 데이터 추가됐으니, counter 총갯수도 +1 (순차적 진행을 위해 콜백함수 사용!)
            // operator의 종류 $set(변경), $inc(증가), $min(기존값보다 적을때에만 변경), $rename(key값 이름 변경),... etc.
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost:1} }, function(error, result){  // object형 자료인 게시물갯수가 name인 자료의 totalPostCnt 를 하나 +1 해주기
                if(error){
                    console.log('---ERROR발생---');
                    console.log(error);
                }else{
                    response.send('RESPONSE SEND : 전송완료!'); // 중복되면 안됨 (특히 콜백함수에서)
                    console.log('지금까지 발행한 총 게시물 갯수는 '+totalPostCnt);
                }
            });
        });
    });  
});


// /list로 GET 요청어면 실DB에 저장된 데이터 보여주기 (위의 add 상의 제목/날짜)
app.get('/list', function(request, response){
    
    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {postsArray : result});

    });
 //   response.sendFile(__dirname + '/list.');

});

app.delete('/delete', function(request, response){
    console.log('REQUEST.BODY : '+request.body._id);
    console.log('REQUEST.BODY : '+JSON.stringify(request.body));    // object 형태 출력하는 법

    // request에 담겨온 i는 문자형 : list.ejs의 ajax data참고
    // 숫자형으로 변환해주기 (DB에는 숫자형으로 지정)
    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne(request.body, function(){
        console.log('삭제완료!!');
        response.status(200).send({message : '성공했당'});  //  400 부여 시 무조건 FAIL로 떨어짐
    });
  });

  // :id의 뜻은 detail/xxx로 GET 요청경우(parameter)
  app.get('/detail/:id', function(request, response){
    
    // request에 담겨온 id는 문자형
    // 숫자형으로 변환해주기 (DB에는 숫자형으로 지정)
    request.params.id = parseInt(request.params.id);
      db.collection('post').findOne({_id : request.params.id}, function(error, result){
        console.log(result);
        response.render('detail.ejs', {data : result});  
    });
  });