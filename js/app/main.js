/* globals: bookapp, define, _ENMARCHA_MOCK_, service_root, _SERVICES_ROOT_PRO_,  enmarcha , localstorage */

define(['jquery', 'Ractive', 'Backbone', 'foundation', 'app/messages','rvc!app/messages', 'rvc!app/auth'],
function($, Ractive, Backbone, foundation, messages, MessagesView, AuthView){
  "use strict";

  /*********** BEGIN config parameters ***************/

  //Define si app utiliza entorno mock o no
  var _ENMARCHA_MOCK_ = false;
  //INT/PRO url services
  var _SERVICES_ROOT_PRO_ = 'https://api.yammer.com/api/v1';

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
    redirect_uri: 'http://enciosco.encamina.com:9000/authenticated',
    messages: [],
    currentMessage: -1,
    references: {},
    render: {
      main: '#render-main'
    },
    services: {
      //messages: 'getmessages',
      messages: 'messages.json',
      //oauth: 'http://localhost:9000/oauth',
      oauth: 'https://www.yammer.com/dialog/oauth'
    },
    service_root: service_root,
    appUrl: 'http://enciosco.encamina.com:9000',
    defaultUrl: '/',
    routes: {
        "": "home",
        "auth": "v:auth",
        "logout": "logout",
        "messages": "messages"
    },
    views: {
      'auth':{
        target: 'main',
        template: AuthView
      },
      'messages':{
        target: 'main',
        template: MessagesView,
        data: {messages: []}
      }
    },
    handlers: {
      home: function() {

        if (localStorage.getItem('token')){
          enmarcha.gotoPage('messages');
        }else{
          enmarcha.gotoPage('auth');
        }
      },
      logout: function(){
        localStorage.clear();
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
