/* global define , enmarcha, debugger */

define(['Ractive', 'Backbone'], function(Ractive, Backbone){
  "use strict"

  var exports = {};

  exports.show = function(app){

    enmarcha.getService(app, 'books', {}, {}, function(data){
      
      app.views.show('books', {books: data});      
    });
  };
  
  exports.showBook = function(app, bookid){

    app.views.show('books', {id:bookid});
  };

  //presencia de este methodo cuasa delegacion del "routing" 
  exports.handleRoute = function(app, args){

    if(args[0]){
      this.showBook(app, args[0]);
    } else {
      this.show(app);
    }
  };

  exports.init = function(app){

    var view = app.views.get('books');
    view.on("save", function(){
      alert("Aqui enviamos los datos");

      var book = this.get('form'); 
      enmarcha.postService(app, 'savebook', book, {},function(res){
        
        enmarcha.gotoPage('books');
      });
    });
  };

  return exports;
});

