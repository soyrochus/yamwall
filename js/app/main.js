/* globals: bookapp, define, _ENMARCHA_MOCK_, service_root, _SERVICES_ROOT_PRO_,  enmarcha , localstorage */

define(['jquery', 'Ractive', 'Backbone', 'foundation', 'app/messages','rvc!app/messages', 'rvc!app/auth'],
function($, Ractive, Backbone, foundation, messages, MessagesView, AuthView){
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
    render: {
      main: '#render-main'
    },
    services: {
      messages: 'getmessages',  // 'messages/my_feed.json',
      initauth: 'initauth',     //'https://www.yammer.com/dialog/oauth',
      gettoken: 'gettoken'      //'https://www.yammer.com/oauth2/access_token.json'
    },
    service_root: service_root,
    defaultUrl: '/',
    routes: {
        "": "home",
        "auth": "v:auth",
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
        if (localStorage.token){
          enmarcha.gotoPage('messages');
        }else{
          enmarcha.gotoPage('auth');
        }
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
