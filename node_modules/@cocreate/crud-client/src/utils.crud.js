(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
        	return factory()
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  
  function 	__mergeObject(target, source) 
  {
  	target = target || {};
  	for (let key of Object.keys(source)) {
  		if (source[key] instanceof Object) {
  			Object.assign(source[key], __mergeObject(target[key], source[key]))
  		}
  	}
  	
  	Object.assign(target || {}, source)
  	return target
  }
  
  function __createObject(data, path) 
  {
  	if (!path) return data;
  	
  	let keys = path.split('.')
  	let newObject = data;
  
  	for (var  i = keys.length - 1; i >= 0; i--) {
  		newObject = {[keys[i]]: newObject}				
  	}
  	return newObject;
  }
  
  function __createArray(key, data)
  {
    try {
      let item = /([\w\W]+)\[(\d+)\]/gm.exec(key)
      if (item && item.length == 3) {
        let arrayKey = item[1];
        let index = parseInt(item[2]);
        
        if (!data[arrayKey] || !Array.isArray(data[arrayKey])) {
          data[arrayKey] = [];
        } 
        data[arrayKey][index] = data[key];
        delete data[key];
        key = arrayKey;
      }
    } catch {
      console.log('create array error');
    }
    return key;
  }
  
  function getValueByPath(path, data)
  {
    try {
      if (!path || !data) return null;
      
      if (data[path]) return data[path];

      let keys = path.split('.');
      
      let tmp = { ...data};
      for (var i = 0; i < keys.length; i++ ) {
        if (!tmp) break;
        tmp = tmp[keys[i]];
      }
      return tmp;

    } catch {
      return null;
    }
  }
  
  function isObject(item) {
    return (!!item) && (item.constructor === Object);
  }
  function isArray(item) {
    return (!!item) && (item.constructor === Array);
  }
  
  function decodeObject(data) {
    let keys = Object.keys(data)
    let objectData = {};
    
    keys.forEach((k) => {
      k = __createArray(k, data);
      if (k.split('.').length > 1) {
        let newData = __createObject(data[k], k);
        delete data[k];
        
        objectData = __mergeObject(objectData, newData);
      } else {
        objectData[k] = data[k];
      }
    })
    return objectData;
  }
  
  function encodeObject(data) {
    let keys = Object.keys(data);
    let newData = {};
    keys.forEach((k) => {
      let data_value = data[k];
      if (isObject(data[k])) {
        let new_obj = encodeObject(data[k]);
        
        let newKeys = Object.keys(new_obj);
        newKeys.forEach((newKey) => {
          let value = new_obj[newKey];
          newKey = k + "." + newKey;
          newData[newKey] = value;
        })
        
      } else if (isArray(data_value)){
        data_value.forEach((v, index) => {
          newData[`${k}[${index}]`] = v;
        })
      } else {
        newData[k] = data[k];
      }
    })
    return newData;
  }
  
  function getAttr(el) {
    if (!el) return
  
    let collection = el.getAttribute('data-collection')
    let document_id = el.getAttribute('data-document_id')
    let name = el.getAttribute('name')
    let room = el.getAttribute('data-room')
    
    let is_realtime = isRealtimeAttr(el);
    let is_save = isSaveAttr(el);
    let is_read = isReadAttr(el);
    let is_update = isUpdateAttr(el);
    let is_listen = isListen(el);
    let broadcast = isBoradcast(el)
    let broadcast_sender = isBoradcastSender(el)

    return { 
      collection, 
      document_id, 
      name, 
      is_realtime, 
      is_save, 
      is_read, 
      is_update, 
      is_listen, 
      broadcast, 
      broadcast_sender,
      room
    }
  }
  
  const isReadAttr = (el) => ( __isValueOfAttr(el, 'data-read_value'));
  const isSaveAttr = (el) => ( __isValueOfAttr(el, 'data-save_value'));
  const isUpdateAttr = (el) => ( __isValueOfAttr(el, 'data-update_value'));
  const isFlatAttr = (el) => ( __isValueOfAttr(el, 'data-flat'));
  const isBoradcast = (el) => ( __isValueOfAttr(el, 'data-broadcast'));
  const isBoradcastSender = (el) => ( __isValueOfAttr(el, 'data-broadcast_sender'));
  const isListen = (el) => ( __isValueOfAttr(el, 'data-listen'));
  const isRealtimeAttr = (el) => ( __isValueOfAttr(el, 'data-realtime'));

  function __isValueOfAttr(el, attr) {
    if (!el) return false;
    let flag = el.getAttribute(attr) === "false" ? false : true;
    return flag
  }
  
  // if value empty  or document_id="{{data.value}}" return false
  function checkAttrValue(value) {
    if (!value) return false;
    if (/{{\s*([\w\W]+)\s*}}/g.test(value)) {
      return false;
    }
    // ToDo temporary... Once we update crdt to not use document_id Null will no longer need
    if (value.toLowerCase() === "null") return false;
    return true;
  }
  
  function isJsonString(str_data) {
    try {
      let json_data = JSON.parse(str_data);
      if (typeof json_data === "object" && json_data != null) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (e) {
      return false;
    }
  }
  
  function isCRDT(input) {
    const { collection, document_id, name } = getAttr(input)
    
    if (isJsonString(collection)) return false;
    if (isJsonString(name)) return false;
  
    if ((input.tagName === "INPUT" && ["text", "email", "tel", "url"].includes(input.type)) || input.tagName === "TEXTAREA") {
      
      if (!name) return false;
      if (!isRealtimeAttr(input)) return false;
      if (input.getAttribute("data-unique") === "true") return false;
      if (input.type === 'password') return false;
      if (!isReadAttr(input)) return false;
      return true;
      
    }
    return false;
  }
  
  // ToDo temporary... Once we update crdt to not use document_id Null will no longer need
  function checkDocumentId(document_id) {
    try {
      if (!document_id) return false;
      if (document_id.toLowerCase() === "null") return false;
      return true;
    } catch(error) {
      return false;
    }
  }
  
  function isJsonString(str_data) {
  try {
    let json_data = JSON.parse(str_data);
    if (typeof json_data === "object" && json_data != null) {
      return true;
    }
    else {
      return false;
    }
  }
  catch (e) {
    return false;
  }
}
  
  
  return {
    decodeObject,
    encodeObject,
    getAttr,
    isRealtimeAttr,
    isReadAttr,
    isSaveAttr,
    isUpdateAttr,
    isFlatAttr,
    checkAttrValue,
    isCRDT,
    checkDocumentId,
    getValueByPath,
    isJsonString
  }

}));
