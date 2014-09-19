define('mu.api', function (require) {
  'use strict';
  
  var is   = require('mu.is'),
      fn   = require('mu.fn'),
      list = require('mu.list');
  
  var multiplex = function (func) {
    var multiplexed = function (/* arr, args... */) {
      var argv = [].slice.call(arguments),
          arr = argv.shift(),
          args = argv;
          
      return each(arr, function (item) {
        return fn.apply(fn.partial(func, item), args);
      });
    };
    
    return multiplexed;
  };
  
  var chain = function (/* api , partials... */) {
    var argv = [].slice.call(arguments),
        api = argv.shift(),
        partials = argv;
        
    var chained = list.map(api, function (func) {
      func = fn.apply(fn.partial(fn.partial, func), partials);
      
      var link = function () {
        var value = fn.apply(func, arguments);
        return is.defined(value) ? value : chained;
      };
      
      return link;
    });
    
    return chained;
  };
  
  var plug = function (socket, plugins) {
    var plugged = function (/* arguments... */) {
      var data = fn.apply(socket, arguments);
      if (is.array(data)) { plugins = list.map(plugins, multiplex); }
      return chain(plugins, data);
    };
    
    return plugged;
  };
  
  return {
    multiplex: multiplex,
    chain: chain,
    plug: plug
  };
});
