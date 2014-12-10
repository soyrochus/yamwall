/* globals require console */

var express = require("express"),
    http = require("http"),
    path = require("path"),
    mdata = require("remedata"),
    app = express();


app.use('/',express.static(path.join(__dirname, './')));

//var appUrl = 'http://yammwall.encamina.com';
var appUrl = 'http://yammerwall.encamina.com'; //local mock

http.createServer(app).listen(80, function(){
    console.log("Express server listening on port 80");
});

app.get('/authenticated', function(request, response){

   response.send('<script>localStorage.setItem("token", location.hash.split("=")[1]);\n' +
                'window.location.href ="' + appUrl + '";</script>');
});


///////// MOCK /////////////
app.get('/oauth', function(request, response){
   console.log('mock auth page');
   response.send('<script>function goback(){ window.location.href="' + appUrl + '/authenticated#accescode=GrOHWSvyU0nngX4Wyx7wwg"; }</script>' +
                 '<h1>Mock pagina de YAMMER. Haz click en el boton para simular la "Authenticacion de Yammer"</h1>' +
                 '<button style="font-size: 24px" onclick="goback();">Acceptar acceso de app "Kiosco Yammer de ENCAMINA"</button>');
});

app.get('/services/getmessages', mdata.toread('yammer/getmessages.json', function(data, request, response){

   response.send(data);
}));


