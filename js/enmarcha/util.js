/* globals: define, this , window, global */

define(['jquery'], function($){

  var exports = {};


  var _id = 0;

  /*
   * Generate global id
   * prefix (optional): string to prefix id
   */
  exports.uniqueId = function (prefix) {
    if(!prefix){
      return "enmarcha-unique-" + _id++;
    }
    else {
      return prefix + _id++;
    }
  };

  /*
   * parent: root node to search in (jQuery | Node)
   * el: child to search for (jQuery | Node)
   * query (optional): filter child-elements under Parent
   */
  exports.nthitem = function(parent, el, query){
    //debugger;
    var p = (parent instanceof Node) ? $(parent) : parent;
    var e = (el instanceof Node) ? el : el.get(0);

    var res;
    if(query){
      res = p.find(query);
    } else{
      res = p.children();
    }
    for(var i=0; i < res.length; i++){
      if (res[i] == el){
        return i;
      }
    }

    return -1;
  };


  return exports;
});