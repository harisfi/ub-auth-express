const { httpRequest } = require('../utils/inet');
const { hash } = require('spark-md5');

exports.getDataMahasiswa = (req, res) => {
  try {
    const [username, password] = [req.body.uname, req.body.pass];
    const passport = hash("123ab" + password) + "_" + username;
    const config = {
      hostname: "bais.ub.ac.id",
      path: `/api/login/jsonapi/?userid=${username}&passport=${passport}&challenge=123ab&appid=EKS1&ipaddr=${req.body.ip}`,
      method: "get",
    };

    httpRequest(config)
      .then((body) => {
        res.json({
          message: "success",
          data: Buffer.from(body).toString("base64"),
        });
      })
      .catch((err) => {
        res.json({
          message: "error",
          data: "HttpRequestError: " + err.message,
        });
      });
  } catch (err) {
    res.json({
      message: "error",
      data: err.message,
    });
  }
};
