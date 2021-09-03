var express = require('express');
var router = express.Router();

const { httpRequest } = require('../utils/inet');
const { hash } = require('spark-md5');
const { getClientIp } = require('@supercharge/request-ip');

router.use(function (req, res, next) {
  req.ip = getClientIp(req);
  next();
});

router.post('/', function(req, res, next) {
  try {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (username && password) {
      const passport = hash('123ab' + password) + '_' + username;
      const config = {
        hostname: 'bais.ub.ac.id',
        path: `/api/login/jsonapi/?userid=${username}&passport=${passport}&challenge=123ab&appid=EKS1&ipaddr=${req.ip}`,
        method: 'get'
      };

      httpRequest(config).then(body => {
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
        data: 'Authentication required.'
      });
    }
  } catch (err) {
    res.json({
      message: 'error',
      data: err.message
    });
  }
});

module.exports = router;
