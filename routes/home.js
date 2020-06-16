var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies['awtToken'];
  if (!token) {
    return res.redirect('/users/loginPage');
  }
  jwt.verify(token, 'verysecretkey', (err, user) => {
    if (err) return res.status(403).send({msg: 'Unauthorized Forbidden'});
    req.user = user;
    next()
  });
};

/* GET home page. */
router.get('/',authenticateToken, function(req, res, next) {
  res.render('home',req.user);
});

module.exports = router;
