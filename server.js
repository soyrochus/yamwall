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

app.get('/services/auth', mdata.toread('yammer/auth.json', function(data, request, response){

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
