const express = require('express');
const router = express.Router();

const { getClientIp } = require('@supercharge/request-ip');
const auths = require('../controllers/auth.controller');

// middleware
router.use((req, res, next) => {
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [username, password] = Buffer.from(b64auth, "base64").toString().split(":");
  
  if (username && password) {
    req.body.ip = getClientIp(req);
    req.body.uname = username;
    req.body.pass = password;
    next();
  } else {
    res.status(401).json({
      message: "error",
      data: "Authentication required.",
    });
  }
});

router.post('/', auths.getDataMahasiswa);

module.exports = router;
