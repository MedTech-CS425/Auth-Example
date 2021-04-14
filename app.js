const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

var user = {};

app.post('/register', async (req, res) => {
  // bcrypt.hash(req.body.password, 12)
  // .then(password =>{
  //   user = {
  //     password,
  //     username: req.body.username
  //   };
  //   console.log(user);
  // }).catch(err => console.error(err));
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    user = {
      password,
      username: req.body.username
    };
    res.json(user);
  } catch (err) {
    console.error(err);
  }
});

app.post('/login', async (req, res) => {
  if (req.body.username === user.username){
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = jwt.sign(user, 'thisisasecret', {
        expiresIn: "1h"
      });
      res.json(token);
    }else {
      res.send('wrong password');
    }
  } else {
    res.send('wron username');
  }
});
const auth = (req, res, next) => {
  const token = req.get('Authorization');
  console.log(token);
  if(token && jwt.verify(token, 'thisisasecret')){
    next();
  }else {
    res.send('Unauthorized Access')
  }
};

app.get('/user', auth, (req, res) => {
  res.send(user);
})



app.listen(3001, () => {
  console.log('The server listening on port 3001');
});