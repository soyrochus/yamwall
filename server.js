/* globals require console */

var express = require("express"),
    http = require("http"),
    path = require("path"),
    mdata = require("remedata"),
    app = express();


app.use('/',express.static(path.join(__dirname, './')));

http.createServer(app).listen(9000, function(){
    console.log("Express server listening on port 9000");
});

app.get('/authenticated', function(request, response){

   var yammerCode = request.query['code'];
 
   response.send('<script>localStorage.yammerCode = "'+ yammerCode + '";\n' +
                'window.location.href ="http://localhost:9000/#process";</script>');
});


///////// MOCK /////////////
app.get('/oauth', function(request, response){
   console.log('mock auth page');
   response.send('<script>function goback(){ window.location.href="http://localhost:9000/authenticated?code=GrOHWSvyU0nngX4Wyx7wwg"; }</script>' +
                 '<h1>Mock pagina de YAMMER. Haz click en el boton para simular la "Authenticacion de Yammer"</h1>' +
                 '<button style="font-size: 24px" onclick="goback();">Acceptar acceso de app "Kiosco Yammer de ENCAMINA"</button>');
});

app.get('/accesstoken', mdata.toread('yammer/auth.json', function(data, request, response){
   
   response.send(data);
}));


app.get('/services/getmessages', mdata.toread('yammer/getmessages.json', function(data, request, response){

   response.send(data);
}));


app.post('/services/get', mdata.towrite('json/books.json',  function(data, newdata, save, req, res){
  //console.log(arguments);
  //console.log(newdata);
  //var record = mdata.merge(newdata, data);
  //save(data);
  //return record;
}));

/*app.put('/services/books/:id', mdata.towrite('mockdata/books.json',  function(data, newdata, save, req, res){

  var record = mdata.merge(newdata, data);
  save(data);
  return record;
}));
*/


    /* var taskId = request.params.id;
    try {
       var res = mdata.find(taskId, data);
       if (res >= 0){
          return data[res];
       } else {
          return {success: false};
       }
    } catch (error) {
        console.log(error);
        response.send(error);
    }*/
