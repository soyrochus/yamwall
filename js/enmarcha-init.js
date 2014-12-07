/* global requirejs, console */

requirejs.config({
  baseUrl: 'js/libs',
  waitSeconds: 200,
  paths: {
    app: '../app',
    enmarcha: '../enmarcha',
    jquery: 'jquery/dist/jquery',
    Ractive: 'ractive/ractive',
    rvc: 'rvc/rvc',
    //'ractive-backbone': 'ractive-backbone/Ractive-Backbone',
    Backbone: 'backbone/backbone',
    'deep-model': 'backbone-deep-model/distribution/deep-model',
    underscore: 'underscore/underscore',
    foundation: 'foundation/js/foundation',
    d3: 'd3/d3',
    epoch: 'epoch/epoch.0.5.2.min',
    'ractive-fade': '../ractive-transitions-fade'
  },
  map: {
    '*': {
      'backbone': 'Backbone',
      'ractive': 'Ractive'
    }
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'deep-model':{
      deps: ['Backbone']
    },
    /*'ractive-backbone':{
      deps: ['Ractive', 'Backbone']
    },*/
    'rvc': {
      deps: ['Ractive',/*'ractive-backbone',*/ 'deep-model']
    },
    'foundation':{
      deps: ['jquery']
    },
    'epoch': {
      deps: ['jquery', 'd3']
    },
    'ractive-fade': {
      deps: ['Ractive']
    },
    'enmarcha':{
      deps: ['jquery', 'd3', 'epoch']
    },
    'app':{
      deps: ['enmarcha']
    }
  },
  callback: function(){

  }
});


requirejs(['jquery', 'Backbone','enmarcha/main', 'app/main'], function($, Backbone, enmarcha, main){
  "use strict";

    $(function(){

      var app;
      //global "routing" - desactivar por enmarcha
      //Default implementacion de Backbone
      try {
        
        var config = enmarcha.getConfig();

        var router_conf ={
            routes: config.routes
        };      
        enmarcha.copyFrom(router_conf, config.handlers);
        var Router = Backbone.Router.extend(router_conf);
        new Router();
        Backbone.history.start({pushState: false, root: config.defaultUrl});

      } catch(err){
        debugger;

        alert("Enmarcha fatal error en config: " + err.message);  
      }

      main.init(app);
    });
});
