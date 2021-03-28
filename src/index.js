const S3 = require('aws-sdk/clients/s3')
const path = require('path');
var fs = require('fs');
const core = require('@actions/core');

const AWS_KEY_ID = core.getInput('aws-key-id', {
  required: true
});
const AWS_ACCESS_KEY = core.getInput('aws-access-key', {
  required: true
});
const mainsource = core.getInput('source', {
  required: true
});
// let mainsource = '../../CoCreateJS/prod';
// let mainsource = '../../CoCreateCSS/dist/Css.js';



// let source = './src/pre.sh'
let s3 = new S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY,
})
// s3.config.setPromisesDependency()
const config = {
  Bucket: 'testcrudbucket',
  ACL: 'public-read'
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

  config.Key = path.relative(mainsource, filename);
  config.Body = fs.createReadStream(filename);

  let r = await s3.upload(config).promise();
  console.log("Saving File in S3", r);
}


uploadFiles(mainsource)
