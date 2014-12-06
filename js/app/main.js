/* globals: bookapp, define, _ENMARCHA_MOCK_, service_root, _SERVICES_ROOT_PRO_,  enmarcha */

define(['jquery', 'Ractive', 'Backbone', 'foundation', 'app/books','rvc!app/books', 'rvc!app/info'],
function($, Ractive, Backbone, foundation, books, BooksView, InfoView){
  "use strict";

  /*********** BEGIN config parameters ***************/

  //Define si app utiliza entorno mock o no
  var _ENMARCHA_MOCK_ = true;
  //INT/PRO url services
  var _SERVICES_ROOT_PRO_ = 'http://webapi:8092/api/';

  /************ END config parameters *****************/

  var service_root;

  if (_ENMARCHA_MOCK_===false){
    service_root = _SERVICES_ROOT_PRO_;
  }
  else {
    service_root = '/services';
  }

  var app = enmarcha.config({
    name: 'bookapp',
    render: {
      main: '#render-main'
    },
    services: {
      books: 'books',
      savebook: 'savebook'
    },
    service_root: service_root,
    defaultUrl: '/',
    routes: {
        "":  "home",
        "info": "v:info",
        "info/:id": "v:info",
        "books": "books",
        "books/:id": "books"
    },
    views: {
      'info':{
        target: 'main',
        template: InfoView
      },
      'books':{
        target: 'main',
        template: BooksView,
        data: {books: []}
      }
    },
    handlers: {
      home: function() {
        enmarcha.gotoPage('info');
      },
      books: books
    }
  });
  
  return {
    init: function(app){
      //primeras acciones en page load

    }
  };
});
