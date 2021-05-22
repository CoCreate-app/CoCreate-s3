const S3 = require('aws-sdk/clients/s3');
var AWS = require('aws-sdk');
const path = require('path');
var fs = require('fs');
const core = require('@actions/core');
const getMime = require('./mime');
const AWS_KEY_ID = core.getInput('aws-key-id', {
    required: true
});
const AWS_ACCESS_KEY = core.getInput('aws-access-key', {
    required: true
});
const BUCKET = core.getInput('bucket', {
    required: true
});
const VISIBILITY = core.getInput('acl', {
    required: true
});
const mainsource = core.getInput('source', {
    required: true
});
const DESTINATION = core.getInput('destination', {
    required: false
});
const INVALIDATIONS = core.getInput('invalidations', {
    required: false
});
const DistributionId = core.getInput('distributionId', {
    required: false
});


AWS.config.update({
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY,
});

// let source = './src/pre.sh'
let s3 = new S3({
        accessKeyId: AWS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY,
    })
    // s3.config.setPromisesDependency()
const config = {
    // Bucket: BUCKET,
    Bucket: BUCKET + DESTINATION,
    ACL: VISIBILITY
        // ContentType: 
}



function uploadFiles(source) {
    if (fs.lstatSync(source).isDirectory()) {
        uploadDirRec(source)
    } else {
        let filename = path.resolve(source)
        uploadFile(filename)
    }
}


function uploadDirRec(source) {
    fs.readdirSync(source).forEach(async function(file) {
        let filename = path.resolve(source, file)

        if (fs.lstatSync(filename).isDirectory()) {
            uploadDirRec(filename);
            return;
        }

        await uploadFile(filename)

    })
}

async function uploadFile(filename) {
    // todo: path.relative return white space on same 
    config.Key = path.relative(mainsource, filename);
    config.Body = fs.createReadStream(filename);
    config.ContentType = getMime(path.extname(filename).substr(1))
    let r = await s3.upload(config).promise();
    console.log("Saving File in S3", r);
}


uploadFiles(mainsource)

console.log('invalidation', INVALIDATIONS);
console.log('Distribution', DistributionId);
if (INVALIDATIONS && DistributionId !== '') {
    var params = {
        DistributionId: DistributionId,
        /* required */
        InvalidationBatch: { /* required */
            CallerReference: Date.now().toString(),
            /* required */
            Paths: { /* required */
                Quantity: 1,
                /* required */
                Items: [
                    '/latest',
                    /* more items */
                ]
            }
        }
    };

    var cloudfront = new AWS.CloudFront();
    // var distributions = cloudfront.listDistributions();

    cloudfront.createInvalidation(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
}