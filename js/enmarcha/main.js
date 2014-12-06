/* globals enmarcha, module, $, define arguments  */

(function(){

  var exports = {};
  /*
   * Assign value to namespace, optionally creating it
   * path: string
   * value: function | object | ..
   */
  exports.ns = function(path, value){
    if (!path){
      throw new Error("path must be set");
    }
    if (typeof value === 'undefined'){
      value = null;
    }
    //browser root
    var root = window;
    var actual = 0;
    var chunks = path.split('.');
    for(var i = 0; i < chunks.length - 1; i++){
      actual++;
      root = root[chunks[i]] = root[chunks[i]] || {};
    }
    root[chunks[actual]] = value;
    
  };
  
  //encapsular require js Define 
  //exports.module = function(){
  //  define.apply(this, arguments);
  //};

  exports.config = function(config){

    //debugger;
    if(config){
      exports._enmarcha_config = config;
    }

    //garantizar nombre y nombre de espacio de la applicacion
    config.name = config.name || 'enmarcha_app';
    var app = exports.ns(config.name, config);
       
    //View instances;; guarantee 'name' property
    var _views = config.views || {};
    for(var vname in _views){
      if (_views.hasOwnProperty(vname)){
        _views[vname].name = vname;
      }
    }
    config.views = new enmarcha.Views({render: config.render, views: _views});
    //routing handler en objetos que tienes metodo 'handleRout'
    var delegateHandler = function(mod){
      var f = mod.handleRoute;
      return function(){
       
        f.apply(mod, [config, arguments]);
      };
    };
    
    //crear routing handler para modules/componentes qye representan un view
    var delegateView = function(handler){

      return function(){
    
        var view = config.views.show(handler.name);
        if (view && view.handleRoute){
          view.handleRoute.apply(view, [config, arguments]);
        }
      };
    };


    //mapear views en routes a handlers
    for(var routename in config.routes){
      if(config.routes.hasOwnProperty(routename) && config.routes[routename]){
        var route = config.routes[routename];
        if(route.indexOf && (route.indexOf('v:') === 0)){        
          var viewname = route.substr(2);
          config.handlers[viewname] = config.views.get(viewname) || function(){};
          config.routes[routename] = viewname;
        }
      }
    }
    
    for(var name in config.handlers){
      //si es componene que tiene handleRoute method; delegar a este methodo
      if(config.handlers.hasOwnProperty(name) && config.handlers[name]){
        var handler = config.handlers[name];
        if(handler.handleRoute){
          config.handlers[name] = delegateHandler(handler);
          if (handler.init){
            //init controllers si tiene function init
            handler.init(config); 
          }
        }
        //si contiene un objeto config de un Vista
        if(handler.template && handler.name){
          config.handlers[name] = delegateView(handler);
        }
      }
    }
    
    return app;
  };

  exports.getConfig = function(){
    return exports._enmarcha_config;
  };
  
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  
  /* Basic Class implementation */  
  // The base Class implementation (does nothing)
  var Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {

    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
      prop[name];
    }
    
    // The dummy class constructor
    var Class = function() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
    
    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
  exports.Class = Class;
  
  /*
   * receivingClass
   * givingClass
   * <anynymous> 3rd parameters: array of method names
   */
  var augment = function(receivingClass, givingClass) {
    if(arguments[2]) { // Only give certain methods.
      for(var i = 2, len = arguments.length; i < len; i++) {
        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
      }
    }
    else { // Give all methods.
      for(var methodName in givingClass.prototype) {
        if(!receivingClass.prototype[methodName]) {
          receivingClass.prototype[methodName] = givingClass.prototype[methodName];
        }
      }
    }
  };
  exports.augment = augment;

  /* (shallow) copy from properies from orig to dest */
  exports.copyFrom = function(dest, orig) {
    
    for(var p in orig) {
      if(orig.hasOwnProperty(p)) {
        dest[p] = orig[p];
      }
    }
    return dest;
  };
  
  var EventEmitter = function() {};
  EventEmitter.prototype.on = function(name, callback, context) {
    if ( !context ) context = this;
    if ( !this._listeners ) this._listeners = {};
    if ( !this._listeners[name] ) this._listeners[name] = [];
    var f = function(e) { callback.apply(context, [e]); };
    this._listeners[name].push(f);
    return this;
  };
  EventEmitter.prototype.trigger = function(name, event) {
    if ( !this._listeners ) this._listeners = {};
    if ( !this._listeners[name] ) return;
    var i = this._listeners[name].length;
    while ( i-- ) this._listeners[name][i](event);
    return this;
  };
  EventEmitter.prototype.raise = EventEmitter.prototype.trigger;
  EventEmitter.prototype.fire = EventEmitter.prototype.trigger;
  EventEmitter.prototype.removeListener = function(name, callback) {
   if ( !this._listeners ) this._listeners = {};
    if ( !this._listeners[name] ) return;
    var i = this._listeners[name].length;
    while ( i-- ) {
      if ( this._listeners[name][i] === callback ) {
        this._listeners[name].splice(i, 1);
      }
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  exports.EventEmitter =EventEmitter;
  

    /*
     * Descargar JSON
     */
    
    exports.getService = function (app, service, data, headers, success, error) {
        var dataId = data.id ? '/'+data.id : ''; // Concatenar el ID si existe (para GET elemento concreto)
        return enmarcha.getJSON(app.service_root + '/' + app.services[service] + dataId, data, headers, success, error);
    };

    exports.postService = function (app, service, data, headers, success, error) {
        return enmarcha.postJSON(app.service_root + '/' + app.services[service], data, headers, success, error);
    };

    exports.putService = function (app, service, data, headers, success, error) {
        return enmarcha.putJSON(app.service_root + '/' + app.services[service] + '/' + data.id, data, headers, success, error);
    };

    exports.deleteService = function (app, service, data, headers, success, error) {
        return enmarcha.deleteJSON(app.service_root + '/' + app.services[service] + '/' + data.id, data, headers, success, error);
    };

    /*
     * Subir/enviar JSON
     */

    exports.getJSON = function (url, data, headers, success, error) {
        var done = success || function (data) { console.log(data); };
        var fail = error || function (err) { console.log(err); };

        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: data,
            headers: headers 
        }).done(done)
               .fail(fail);
    };

    exports.postJSON = function (url, data, headers, success, error) {

        var done = success || function (data) { console.log(data); };
        var fail = error || function (err) { console.log(err); };

        return enmarcha.sendRequest(url, 'POST', data, headers, success, error);
    };

    exports.putJSON = function (url, data, headers, success, error) {

        var done = success || function (data) { console.log(data); };
        var fail = error || function (err) { console.log(err); };

        return enmarcha.sendRequest(url, 'PUT', data, headers, success, error);
    };

    exports.deleteJSON = function (url, data, headers, headers, success, error) {

        var done = success || function (data) { console.log(data); };
        var fail = error || function (err) { console.log(err); };

        return enmarcha.sendRequest(url, 'DELETE', data, headers, success, error);
    };

    exports.sendRequest = function (url, method, data, headers, onSuccess, onError) {
        return $.ajax({
            url: url,
            type: method,
            data: JSON.stringify(data),
            headers: headers, 
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(onSuccess)
               .fail(onError);
    };  

  exports.renderCmp = function(app, target, Cmp, data){

    return new Cmp({
      el: app.render[target],
      data: data
    });
  };

  exports.View = Class.extend({
    
    init: function(config){
      this.events = {};
      if (arguments.length == 1){
        this.name = config.name;
        this.template = config.template;
        this.target = config.target;
      } else {
        
        this.name = arguments[0];
        this.template = arguments[1];
        this.target = arguments[2];
      }
    },
    get: function(){
      return this._instance || null;
    },
    on: function(name, f){
      //debugger;
      this.events[name] = this.events[name] || [];
      this.events[name].push(f);
    },
    applyEvents: function(){
      if (!this._instance){
        return;
      }
      for(var e in this.events){
        if(this.events.hasOwnProperty(e)){
          var events = this.events[e];
          for(var i = 0; i < events.length; i++){
            this._instance.on(e, events[i]);
          }
        }
      }
    }
  });

  exports.Views = Class.extend({
    init:function(config){

      this.render = config.render || {main: '#render-main'};
      this.target = config.target || 'main';
      var _views = config.views || {};
      this.views = {};
      for(var e in _views){
        if(_views.hasOwnProperty(e)){
          this.add(e, _views[e]);
        }
      }
    },
    get: function(name){
      return this.views[name];
    },
    add: function(name, conf){
      
      var view = new exports.View(conf);
      this.views[name] = view;
      return view;
    },
    show: function(name /* , .. */){
    
      var view = this.views[name];
      if(view){
        //cache view is no ha cambiado (evita destruccion y creacion/occultar y mostrar)
        if (this.current !== view){

          //destroy/hide current (cache en caso de view devuelve {cached: true}
          this.remove();          
          this.current = view;
          //crear instancia si no hay
          if (!this.current._instance){
            var _data = (arguments.length > 1)? arguments[1] : null;
            
            view._instance = new view.template({name: view.name,
                                            el: this.render[view.target],
                                            data: _data || view.data || {} });
            view.applyEvents();
          }
        }
        if (this.current._instance.show){
        
          //pasar argymentos de views.show(name,arg1, arg2, etc) a view.show(arg1, arg2, etc)
          var showargs = [];
          for(var i = 1; i < arguments.length; i++){
            showargs.push(arguments[i]);
          }
          this.current._instance.show.apply(view._instance, showargs);
        }
        return view._instance;
      }else{
        console.log('view: ' + name + ' not found in views');
        return false;
      }
    },
    remove: function(){
      if (this.current && this.current._instance){
        if (this.current._instance.remove){
          this.current._instance.remove();
        }
        this.current._instance = null; //quitar referencia
      }
      return true;
    },
    exists: function(name){
      return this.views[name];      
    }
  });
  
  exports.gotoPage = function(page){

    window.location.hash=page;
  };

 
  // Convertir array en 'iterator' (pattern) -> function 'next' 
  // que devuele 'el siguente' en una secuencia
  exports.iterator = function(queue){
    //array `clone` 
    var q = queue.slice(0); 
    return function(){
      if (q.length>0){
        return q.shift(); //devolver cabeza de lista/array (inverse pop)
      }else {
        return null; //devuelve falsy si cola esta vacio
      }
    };
  };

  //Ejecutar con interrupcion ('hilo flojo')
  //operaciones que devuelve el iterator/stream
  // interfaz operacion:: config , state , callback -> void
  // interfaz callback::  newstate -> void
  exports.execWithInterval = function(next, timeout){
    var t = timeout || 1000;
    //sigueinte operacion en t millisecundos
    var nextTick = function(config, state){
      //siguiente operacion del stream
      var n = next();
      if (n){
        setTimeout(function(){
          n(config, state, function(newstate){
            nextTick(config, newstate);
          });
        }, t);
      } 
    };
    return nextTick;
  };       

 
  //en caso de require Js - carga como modulo
  if ((typeof define === 'function') && (typeof define.amd === 'object')) {
    define(function(){ return exports;});
  }
  //definir global enmarcha en qualquier case (contra AMD pero necesario para tener capa de compatibilidad con Enmarcha-UI basico
  exports.ns('enmarcha', exports);

 
})();

