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
                "content-type": "text/html",
                "public": "true",
                "website_id": "5ffbceb7f11d2d00103c4535"
            }
        }
    ]
}