/* globals: bookapp, define, _ENMARCHA_MOCK_, service_root, _SERVICES_ROOT_PRO_,  enmarcha , localstorage */

define(['jquery', 'Ractive', 'Backbone', 'foundation', 'app/messages','rvc!app/messages', 'rvc!app/auth', 'rvc!app/config'],
function($, Ractive, Backbone, foundation, messages, MessagesView, AuthView, ConfigView){
  "use strict";

  /*********** BEGIN config parameters ***************/

  //Define si app utiliza entorno mock o no
  var _ENMARCHA_MOCK_ = true; //false;
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

  //var appUrl = 'http://yammwall.encamina.com';
  var appUrl = 'http://yammerwall.encamina.com'; //Mock local

  var app = enmarcha.config({
    name: 'enciosco',
    client_id: 'mOPBWuDVDTMyWBzkoYHg',
    client_secret: 'kimoqWAj9gKExr0C0bMKoMxwS59NH9uZjXtj8hwk6L4',
    redirect_uri: appUrl + '/authenticated',
    messages: [],
    currentMessage: -1,
    references: {},
    render: {
      main: '#render-main'
    },
    services: {
      messages: 'getmessages',
      //messages: 'messages.json',
      oauth: appUrl + '/oauth'
      //oauth: 'https://www.yammer.com/dialog/oauth'
    },
    service_root: service_root,
    appUrl: appUrl,
    defaultUrl: '/',
    routes: {
        "": "home",
        "auth": "v:auth",
        "config": "v:config",
        "logout": "logout",
        "messages": "messages"
    },
    views: {
      'auth':{
        target: 'main',
        template: AuthView
      },
      'config':{
        target: 'main',
        template: ConfigView
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
    },
    showMenu: function(isVisible){
      if (isVisible){
        $('#menu').hide();
      } else {
        $('#menu').show();
      }
    },
    fullScreenMenu: function(isFullscreen){
      if(isFullscreen){
        $('#panel-full-screen').show();
        $('#panel-normal').hide();
      } else {
        $('#panel-full-screen').hide();
        $('#panel-normal').show();
      }
    }
  });
  
  return {
    init: function(app){
      //primeras acciones en page load
            
      $('#full-screen').on('click',function(){
        debugger;
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
        enciosco.fullScreen = true;
        enciosco.fullScreenMenu(enciosco.fullScreen);
      });
      
      $('#normal-screen').on('click', function(){
        debugger;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        
        enciosco.fullScreen = false;
        enciosco.fullScreenMenu(enciosco.fullScreen);
      });         
    }
  };
});
