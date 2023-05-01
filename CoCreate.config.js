module.exports = {
    "config": {
        "organization_id": "5ff747727005da1c272740ab",
        "apiKey": "2061acef-0451-4545-f754-60cf8160",
        "host": "general.cocreate.app"
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