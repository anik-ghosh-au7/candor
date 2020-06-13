var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) res.status(401).send({msg: 'Unauthorized Access'});

  jwt.verify(token, 'verysecretkey', (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    console.log('auth',user);
    next()
  });
};

/* GET home page. */
router.get('/',authenticateToken, function(req, res, next) {
  res.render('home',req.user);
});

router.get('/webpage/:url',authenticateToken, function(req, res, next) {
  res.send(req.params.url,req.user);
});

module.exports = router;
