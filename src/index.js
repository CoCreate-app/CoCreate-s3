const S3 = require('aws-sdk/clients/s3')
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



// let source = './src/pre.sh'
let s3 = new S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY,
})
// s3.config.setPromisesDependency()
const config = {
  // Bucket: BUCKET,
  Bucket: BUCKET+DESTINATION,
  ACL: VISIBILITY
  // ContentType: 
}



function uploadFiles(source) {
  if (fs.lstatSync(source).isDirectory()) {
    uploadDirRec(source)
  }else
  {
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
  // todo: path.relative return white space on same string
  config.Key = path.relative(mainsource, filename);
  config.Body = fs.createReadStream(filename);
  config.ContentType = getMime(path.extname(filename).substr(1))
  let r = await s3.upload(config).promise();
  console.log("Saving File in S3", r);
}


uploadFiles(mainsource)


