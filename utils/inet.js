const https = require('https');

exports.httpRequest = (params, postData) => {
  return new Promise((resolve, reject) => {
    const req = https.request(params, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(res.statusCode + ' ' + res.statusMessage));
      }

      var body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      
      res.on('end', _ => {
        try {
          body = Buffer.concat(body).toString();
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });

    req.on('error', err => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}
