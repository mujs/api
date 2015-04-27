define('mu.api.multiplex', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      isArray   = require('mu.is.array'),
      apply     = require('mu.fn.apply'),
      partial   = require('mu.fn.partial'),
      each      = require('mu.list.each');
  
  var multiplex = function (func) {
    var multiplexed = function (/* context, args... */) {
      var argv = [].slice.call(arguments),
          context = argv.shift(),
          args = argv;

      if (!isDefined(context)) { return; }
      if (!isArray(context)) { context = [context]; }
          
      return each(context, function (ctx) {
        return apply(partial(func, ctx), args);
      });
    };
    
    return multiplexed;
  };
  
  return multiplex;
});

define('mu.api.chain', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      apply     = require('mu.fn.apply'),
      partial   = require('mu.fn.partial'),
      map       = require('mu.list.map');
      
  
  var chain = function (/* api , partials... */) {
    var argv = [].slice.call(arguments),
        api = argv.shift(),
        partials = argv;
        
    var chained = map(api, function (func) {
      // func is partially applied with initial partials
      // partialFunc === partial(func, partials...)
      var partialFunc = apply(partial(partial, func), partials);
      
      var link = function () {
        // value = func(partials..., arguments...)
        var value = apply(partialFunc, arguments);
        return isDefined(value) ? value : chained;
      };
      
      return link;
    });
    
    return chained;
  };
  
  return chain;
});

define('mu.api.plug', function (require) {
  'use strict';
  
  var apply     = require('mu.fn.apply'),
      map       = require('mu.list.map'),
      multiplex = require('mu.api.multiplex'),
      chain     = require('mu.api.chain');
  
  var plug = function (socket, plugins) {
    plugins = map(plugins, multiplex);
    
    var plugged = function (/* arguments... */) {
      var data = apply(socket, arguments);
      return chain(plugins, data);
    };
    
    return plugged;
  };
  
  return plug;
});

define('mu.api', function (require) {
  'use strict';
  
  return {
    multiplex: require('mu.api.multiplex'),
    chain:     require('mu.api.chain'),
    plug:      require('mu.api.plug')
  };
});
