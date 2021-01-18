const S3 = require('aws-sdk/clients/s3')
const path = require('path');
var fs = require('fs');
const core = require('@actions/core');

const AWS_KEY_ID = core.getInput('aws-key-id');
const AWS_ACCESS_KEY = core.getInput('aws-access-key');
const source = core.getInput('source');


console.log("Saving File in S3");
let s3 = new S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY,
})
const config = {
  Key: path.basename(source),
  Bucket: 'testcrudbucket',
  Body: fs.createReadStream(source),
  ACL: 'public-read'
}
s3.upload(config, function(err, data) {

  if (err) {
    console.log("could not upload to s3: ", err)
    process.exit(1)
  }
  else
    console.log("File saved in S3", data)

})
