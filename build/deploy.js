const src = './src/';
const dest = './public/';
const ncp = require('ncp').ncp;

ncp.limit = 16;
 
ncp(src, dest, function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('Files Deployed Successfully ...');
});