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
    console.log('auth',user);
    next()
  });
};

// router.post('/',authenticateToken, );
// router.post('/',authenticateToken, );
// router.get('/',authenticateToken, );

router.get('/:url/:category',authenticateToken, function(req, res, next) {

  console.log(req.params.url,req.user,req.params.category)
  res.send(req.params.url,req.user,req.params.category);
});

module.exports = router;
