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

router.post('/',authenticateToken, function(req, res, next) {

  console.log("on server", req.body.current_url,req.user,req.body.context);
  // console.log("request : ", req);
  res.render('website_content',{category:req.body.context,website:req.body.current_url,user:req.user.name});

});

module.exports = router;
