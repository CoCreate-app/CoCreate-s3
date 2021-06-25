(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() {
        	return factory(window)
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(null);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(window);
  }
}(typeof self !== 'undefined' ? self : this, function (wnd) {
  function getCommonParams() 
  {
    let config = {};
    if (wnd && wnd.config) {
      config = wnd.config
    }
    
    return {
      "apiKey":           config.apiKey,
      "organization_id":  config.organization_Id,
    }
  }
  
  function getCommonParamsExtend(info) 
  {
    let config = {};
    if (wnd && wnd.config) config = wnd.config
    
    return {
      "apiKey":           info.apiKey || config.apiKey,
      "organization_id":  info.organization_id || config.organization_Id,
    }
  }
  
  function generateSocketClient (namespace, room) 
  {
    let config = {};
    if (wnd && wnd.config) config = wnd.config
    
    let ns = namespace || config.organization_Id
    let rr = room || '';
    if (rr) {
      return `${ns}/${rr}`
    } else {
      return ns;
    }
  }
  
  return {getCommonParams, getCommonParamsExtend, generateSocketClient};
}));
