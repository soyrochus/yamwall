/* globals: bookapp, define, _ENMARCHA_MOCK_, service_root, _SERVICES_ROOT_PRO_,  enmarcha , localstorage */

define(['jquery', 'Ractive', 'Backbone', 'foundation', 'app/messages','rvc!app/messages', 'rvc!app/auth',  'rvc!app/process'],
function($, Ractive, Backbone, foundation, messages, MessagesView, AuthView, ProcessView){
  "use strict";

  /*********** BEGIN config parameters ***************/

  //Define si app utiliza entorno mock o no
  var _ENMARCHA_MOCK_ = true;
  //INT/PRO url services
  var _SERVICES_ROOT_PRO_ = 'https://www.yammer.com/api/v1';

  /************ END config parameters *****************/

  var service_root;

  if (_ENMARCHA_MOCK_===false){
    service_root = _SERVICES_ROOT_PRO_;
  }
  else {
    service_root = '/services';
  }

  var app = enmarcha.config({
    name: 'enciosco',
    client_id: 'mOPBWuDVDTMyWBzkoYHg',
    client_secret: 'kimoqWAj9gKExr0C0bMKoMxwS59NH9uZjXtj8hwk6L4',
    redirect_uri: 'http://localhost:9000/authenticated',
    render: {
      main: '#render-main'
    },
    services: {
      messages: 'getmessages',  // 'messages/my_feed.json',
      oauth: 'http://localhost:9000/oauth',     //'https://www.yammer.com/dialog/oauth',
      accesstoken: 'http://localhost:9000/accesstoken'      //'https://www.yammer.com/oauth2/access_token.json'
    },
    service_root: service_root,
    defaultUrl: '/',
    routes: {
        "": "home",
        "auth": "v:auth",
        "process": "v:process",
        "logout": "logout",
        "messages": "messages"
    },
    views: {
      'auth':{
        target: 'main',
        template: AuthView
      },
      'process':{
        target: 'main',
        template: ProcessView
      },
      'messages':{
        target: 'main',
        template: MessagesView,
        data: {messages: []}
      }
    },
    handlers: {
      home: function() {
        if (localStorage.token){
          enmarcha.gotoPage('messages');
        }else{
          enmarcha.gotoPage('auth');
        }
      },
      logout: function(){
        delete localStorage.token;
        enmarcha.gotoPage('');
      },
      messages: messages
    }
  });
  
  return {
    init: function(app){
      //primeras acciones en page load

    }
  };
});
