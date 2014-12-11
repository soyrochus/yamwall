/* global define , enmarcha, debugger */

define(['Ractive', 'Backbone', 'ractive-fade'], function(){
  "use strict"

  var exports = {};

  //presencia de este methodo cuasa delegacion del "routing" 
  exports.handleRoute = function(app /*,  args */){
    app.showMenu(true);
    app.views.show('messages', {user: {}, message: {}});      
    exports.getMessages(app, function(){
      setInterval(function(){
        exports.changeMessage(app);
      }, 4000);
    });
  };

  exports.changeMessage = function(app){
    
    if (app.messages.length === 0){
      return;
    }
    
    app.currentMessage++;
    if(app.currentMessage === app.messages.length){
      app.currentMessage = 0;
    }
    var view = app.views.get('messages').get();
    if (view){
      var message = app.messages[app.currentMessage];
      var attachments = message.attachments.filter(function(e){
                          return !!e.inline_html;
                        });
      var images = message.attachments.filter(function(e){
                          if (e.content_class && (e.content_class === 'Image')){
                            return true;
                          } else {
                            return false;
                          }
                        });
      app.views.teardown(function(){
        app.views.show('messages',{user: app.references[message.sender_id], message:message,
                                   attachments: attachments, images: images});
      });
      
    }    
  };

  exports.getMessages = function(app, callback){

    var auth_header = 'Bearer ' + localStorage.getItem('token');
    var headers = {
      'Authorization': auth_header
    };

    enmarcha.getService(app, 'messages', {}, headers, function(data){
      app.messages = app.messages.concat(data.messages);
      app.references = data.references.reduce(function(obj, e){
         obj[e.id] = e;                
         return obj;
      }, app.references);
      exports.changeMessage(app);

      if(callback){
        callback();
      }
    }, function(error){
         alert(error.message);
       }); 
  };

  exports.init = function(app){


  };

  return exports;
});

