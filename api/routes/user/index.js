const router = require('express').Router();
const Users = require('./db').Users;

router.get('/user', (req, res, next) => {
  // Because there is no token verification, the first entry of all data is taken
  Users.all((err, users) => {
    if (err) return next(err);
    res.send({
      code: '0000',
      result: (users || []).length ? users[0] : null,
    })
  })
});

router.post('/user', (req, res, next) => {
  const {name, email, phone} = req.body
  if (!(name && email && phone)) {
    res.send({
      code: '0001',
      prompt: 'Please complete all information !'
    })
  } else {
    Users.create({
      name,
      email,
      phone
    }, (err, data) => {
      if (err) return next(err);
      res.send({
        code: '0000',
        result: null,
        prompt: 'Operation successful !',
      })
    });
  }
});

// 更新数据
router.put('/user', (req, res, next) => {
  const {id, name, email, phone} = req.body
  if (!(id && name && email && phone)) {
    res.send({
      code: '0001',
      prompt: 'Parameter exception !'
    })
  } else {
    Users.update({
      id,
      name,
      email,
      phone
    }, (err, data) => {
      if(err) return next(err);
      res.send({
        code: '0000',
        result: null
      })
    });
  }
})
module.exports = router;
