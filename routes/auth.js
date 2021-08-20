var express = require('express');
var router = express.Router();

const { httpRequest } = require('../utils/inet');
const SparkMD5 = require('spark-md5');

router.post('/', function(req, res, next) {
  try {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (username && password) {
      const cfgIp = {
        hostname: 'cloudflare.com',
        path: '/cdn-cgi/trace',
        method: 'get'
      };

      const cfgBais = {
        hostname: 'bais.ub.ac.id',
        path: '/api/login/jsonapi',
        method: 'get'
      };

      let passport = SparkMD5.hash('123ab' + password) + '_' + username;
      res.json({
        message: 'success',
        data: Buffer.from(passport).toString('base64')
      });

      httpRequest(cfgIp).then(body => {
        let ip = body.split('\n')[2].split('=')[1];
        let passport = SparkMD5.hash('123ab' + password) + '_' + username;

        cfgBais.path += `/?userid=${username}&passport=${passport}&challenge=123ab&appid=EKS1&ipaddr=${ip}`;
        return httpRequest(cfgBais);
      }).then(body => {
        res.json({
          message: 'success',
          data: Buffer.from(body).toString('base64')
        });
      }).catch(err => {
        res.json({
          message: 'error',
          data: err.message
        });
      });
    } else {
      res.status(401).json({
        message: 'error',
        data: 'Authentication required.'}
      );
    }
  } catch (err) {
    res.json({
      message: 'error',
      data: err.message
    });
  }
});

module.exports = router;
