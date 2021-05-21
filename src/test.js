var AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: "AKIAZKETJ5PS76HTXUGF",
    secretAccessKey: "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",
});

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Call S3 to list the buckets
var bucketParams = {
    Bucket: 'testcrudbucket',
};

// Call S3 to obtain a list of the objects in the bucket
// s3.listObjects(bucketParams, function(err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data);
//     }
// });

var params = {
    DistributionId: 'E1UQ5BHNWKZF8M',
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