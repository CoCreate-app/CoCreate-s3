const S3 = require('aws-sdk/clients/s3')
const path = require('path');
var fs = require('fs');
module.exports = function(file) {
  console.log("Saving File in S3");
  let s3 = new S3({
    accessKeyId: 'AKIAZKETJ5PS53VASL4A',
    secretAccessKey: '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',
  })
  const config = {
    Key: path.basename(file),
    Bucket: 'testcrudbucket',
    Body: fs.createReadStream(file),
    ACL: 'public-read'
  }
  s3.upload(config, function(err, data) {

    if (err) {
      console.log("error happend:", err)
      process.exit(1)
    }
    else
      console.log("File saved in S3", data)

  })
}
