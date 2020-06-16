var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { request } = require('express');

const authenticateToken = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) {
    return res.redirect('/users/loginPage');
  }
  jwt.verify(token, 'verysecretkey', (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    console.log('auth',user);
    next()
  });
};

// router.post('/',authenticateToken, );
// router.post('/',authenticateToken, );
// router.get('/',authenticateToken, );

router.get('/',authenticateToken, function(req, res, next) {

  console.log("on server", req.query.url,req.user,req.query.category)
  // res.status(200).send(req.body.url,req.user,req.body.category);
  
});

module.exports = router;
