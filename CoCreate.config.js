module.exports = {
    "config": {
        "organization_id": "",
        "key": "",
        "host": ""
    },
    "sources": [
        {
            "collection": "files",
            "document": {
                "_id": "60299be4e979fb17407e25c7",
                "name": "index.html",
                "path": "/docs/s3/index.html",
                "src": "{{./docs/index.html}}",
                "hosts": [
                    "*",
                    "general.cocreate.app"
                ],
                "directory": "/docs/s3",
                "parentDirectory": "{{parentDirectory}}",
                "content-type": "{{content-type}}",
                "public": "true",
                "website_id": "644d4bff8036fb9d1d1fd69c"
            }
        }
    ]
}