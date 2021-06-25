import socket from '@cocreate/socket'


// will be located in crud utility
// crud.save(elements)
async function save(elements) {
	for (var i = 0; i < elements.length; i++) {
		await crud.saveElement(elements[i])
	}

    document.dispatchEvent(new CustomEvent('{endEvent}', {
  		detail: {}
  	}))
}


// crud.saveElement()
async function saveElement(element) {
	const {collection, document_id, name, namespace, room, broadcast, broadcast_sender, is_save } = crud.getAttr(element)
	
	if (!is_save || !collection ||!name) { 
		return;
	}
	
	if (isCRDT) {
		CoCreate.crdt.replaceText({ collection, name, document_id, name, value });
	}
	
	else {
		var data = await crud.updateDocument({
			namespace,
			room,
			collection,
			document_id,
			upsert: true, 
			broadcast,
			broadcast_sender,
			data: {
				[name]: value
			},
		})
	}
	
	/* dont knoow which is better requestid or setid*/
	if (data.document_id && document_id !== data.document_id) {
		await crud.setDocumentId({element}) // element, collection, docuement_id
	}
	
}

// crud.setDocumentId
// async function setDocumentId(element) {
// 	if (!form && element) {
// 		form = element.closest('form');
// 	}
// 	if (form) {
// 	    await	CoCreate.form.setDocumentId(form)
// 	} else if (element) {
// 		element.setAttribute('data-document_id', document_id);
// 	}
// }
