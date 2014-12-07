/* global define , enmarcha, debugger */

define(['Ractive', 'Backbone'], function(Ractive, Backbone){
  "use strict"

  var exports = {};

  //presencia de este methodo cuasa delegacion del "routing" 
  exports.handleRoute = function(app, args){

    app.views.show('messages', {});      
    exports.getMessages(app);

  };

  exports.getMessages = function(app){
    debugger;
    var auth_header = 'Bearer ' + localStorage.token;
    enmarcha.getService(app, 'messages', {}, {'Authentication': auth_header}, function(data){
      debugger;
      if (app.messages.length == 0){
        app.messages = data.messages;
        app.currentMessage = (app.messages.length > 0)? 0 : -1;
      }else {
        app.messages = app.messages.concat(data.messages);
      }
      var view = app.views.get('messages').get();
      if (view){
        view.set(app.messages[app.currentMessage]);        
      }
    }, function(error){
         alert(error.message);
       }); 
  };

  exports.init = function(app){

    app.messages = [];
    app.currentMessage = -1;
  };

  return exports;
});

