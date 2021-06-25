// import {getCommonParams, getCommonParamsExtend, generateSocketClient} from "@cocreate/socket-client/src/common-fun.js"

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["@cocreate/socket-client/src/common-fun.js", "./utils.crud.js"], function(commonFunc, utilsCrud) {
        	return factory(window, commonFunc, utilsCrud)
        });
    } else if (typeof module === 'object' && module.exports) {
      let wnd = {
        config: {},
        File: {}
      }
      const commonFunc = require("@cocreate/socket-client/src/common-fun.js")
      const utils = require("./utils.crud.js")
      module.exports = factory(wnd, commonFunc, utils);
    } else {
        root.returnExports = factory(window, root["@cocreate/socket-client/src/common-fun.js"], root["./utils.crud.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (wnd, commonFunc, utilsCrud) {
  
  const CoCreateCRUD = {
    socket: null,
    setSocket: function(socket) {
      this.socket = socket;
    },

    readDocumentList: async function(info){
      if( !info ) return false;
      let request_data = commonFunc.getCommonParams();
      if (!info.collection) {
        return false;
      }
      
      request_data = {...request_data, ...info};
      
      const room = commonFunc.generateSocketClient(info.namespace, info.room);
      const request_id = this.socket.send('readDocumentList', request_data);
      
      try {
        let response = await this.socket.listenAsync(request_id);
        return response;
      } catch(e) {
        console.log(e)
        return null;
      }
    },
    
    createDocument: async function(info) {
      if (info === null) {
        return false;
      }
      let commonData = commonFunc.getCommonParamsExtend(info);
      let request_data = {...info, ...commonData};
  
      let data = info.data || {};
      
      if (!data['organization_id']) {
        data['organization_id'] = wnd.config.organization_Id
      }
      if (info['data']) {
        data = {...data, ...info['data']}
      }
      
      //. rebuild data
      request_data['data'] = data;
  
      const room = commonFunc.generateSocketClient(info.namespace, info.room);
      let request_id = this.socket.send('createDocument', request_data, room);
      
      try {
        let response = await this.socket.listenAsync(request_id);
        return response;
      } catch(e) {
        console.log(e)
        return null;
      }
    },
    
    updateDocument: async function(info) {
      if (!info) return false;
      
      if (info['document_id'] && !utilsCrud.checkDocumentId(info['document_id']))
        return false;

      let commonData = commonFunc.getCommonParamsExtend(info);
      
      let request_data = {...info, ...commonData};
      
      if( typeof info['data'] === 'object' ) {
        request_data['set'] = info['data']
      }
      if( Array.isArray(info['delete_fields']) ) request_data['unset'] = info['delete_fields'];
      
      if(!request_data['set'] && !request_data['unset']) return false;
      
      if (info.broadcast === false) {
        request_data['broadcast'] = false;
      }
      
      /** socket parameters **/
      if (info['broadcast_sender'] === undefined) {
        request_data['broadcast_sender'] = true;
      }
      
      const room = commonFunc.generateSocketClient(info.namespace, info.room);
      let request_id = this.socket.send('updateDocument', request_data, room);
      
      try {
        let response = await this.socket.listenAsync(request_id);
        return response;
      } catch(e) {
        console.log(e)
        return null;
      }
    },
    
    /**
     * Usage: var data = await crud.readDocumentNew({collection, document_id})
     */
    readDocument: async function(info) {
      
      //. 
      if (info === null) {
        return null;
      }
      
      if (!info || !utilsCrud.checkDocumentId(info['document_id'])) {
        return null;
      }
      
      let commonData = commonFunc.getCommonParamsExtend(info);
      let request_data = {...info, ...commonData};
      let request_id = this.socket.send('readDocument', request_data);
      
      try {
        //. new section
        const room = commonFunc.generateSocketClient(info.namespace, info.room);
        let response = await this.socket.listenAsync(request_id);
        return response;
      } catch (e) {
        console.log(e)
        return null;
      }
    },
    
    
    deleteDocument: async function (info) {
      if (!info || !utilsCrud.checkDocumentId(info['document_id'])) {
        return null;
      }
      
      let commonData = commonFunc.getCommonParamsExtend(info);
      let request_data = {...info, ...commonData};
      
      const room = commonFunc.generateSocketClient(info.namespace, info.room);
      let request_id = this.socket.send('deleteDocument', request_data, room);
      try {
        //. new section
        let response = await this.socket.listenAsync(request_id);
        return response;
      } catch (e) {
        console.log(e)
        return null;
      }
    },
  
  
   /** export / import db functions **/
    exportCollection: function(info) {
      if (info === null) return;
  
      let request_data = commonFunc.getCommonParamsExtend(info);
      request_data['collection'] = info['collection'];
      request_data['export_type'] = info['export_type'];
  
      request_data['metadata'] = info['metadata']
      this.socket.send('exportDB', request_data);
    },
    
    importCollection: function(info) {
      const {file} = info;
      if (info === null || !(file instanceof wnd.File)) return;
  
      const extension = file.name.split(".").pop();
      
      if (!['json','csv'].some((item) => item === extension)) return;
  
      let request_data = commonFunc.getCommonParamsExtend(info)
      request_data['collection'] = info['collection']
      request_data['import_type'] = extension;
      this.socket.send('importDB', request_data)
      this.socket.sendFile(file);
    },
    
    listen: function(message, fun) {
      this.socket.listen(message, fun);
    },
    
    // ToDo: Depreciate?
    listenAsync: function(eventname) {
      return this.socket.listenAsync(eventname);
    },
  
  	createSocket: function(host, namespace) {
  		if (namespace) {
  			this.socket.create({
  				namespace: namespace, 
  				room: null,
  				host: host
  			});
  			this.socket.setGlobalScope(namespace);
  		} else {
  			this.socket.create({
  				namespace: null, 
  				room: null,
  				host: host
  			});
  		}
  	},
  	
		read: async function(element, is_flat) {
      const {collection, document_id, name, namespace, room, is_read } = utilsCrud.getAttr(element)
      if ( utilsCrud.checkAttrValue(document_id)) return;
      
      if (is_flat !== false) is_flat = true
      
      if (utilsCrud.isJsonString(collection) || 
          utilsCrud.isJsonString(document_id)) 
      {
        return null
      }
      
      if (document_id && collection && is_read) {
        const responseData = await this.readDocument({ namespace,	room, collection, document_id, name, is_flat })
        return responseData
      } 
      return null;
		},
		
		save: async function (el_data_list) {
			if (!el_data_list) return;
			for (let i = 0; i < el_data_list.length; i++) {
				await this.saveElement(el_data_list[i]);
			}
		},
		
		saveElement: async function({ element, value, is_flat }) {
			if (!element || value === null) return;
			const {collection, document_id, name, namespace, room, broadcast, broadcast_sender, is_save } = utilsCrud.getAttr(element)
			
			if (!is_save || !collection || !name) {
				return;
			}
			
			if (utilsCrud.isCRDT(element) && wnd.CoCreate.crdt) {
				wnd.CoCreate.crdt.replaceText({
					collection,
					name, 
					document_id,
					name, 
					value
				})
			} else {
				let data = await this.updateDocument({
					namespace,
					room,
					collection,
					document_id,
					upsert: true, 
					broadcast,
					broadcast_sender,
					is_flat : is_flat !== false ? true : false,
					data: {
						[name]: value
					},
				})
  			if (data.document_id && document_id !== data.document_id) {
  				await this.setDocumentId({element, docuement_id: data.document_id}) // element, collection, docuement_id
  			}
			}
		},


    // ToDo: if form we need to send collection and document_id
    setDocumentId: async function({element, form, document_id}) {
    	if (!form && element) {
    		form = element.closest('form');
    	}
    	if (form) {
    	    await CoCreate.form.setDocumentId(form)
    	} else if (element) {
    		element.setAttribute('data-document_id', document_id);
    	}
    },
  	
  	...utilsCrud
  }
  
  return CoCreateCRUD;
}));

