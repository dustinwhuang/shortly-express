const models = require('../models');
const Promise = require('bluebird');
const _ = require('underscore');

const createNewSession = (req, res, next) => {
  models.Sessions.create()
    .then(({insertId}) => {
      models.Sessions.get({id: insertId})
        .then(({hash}) => {
          req.session = {hash: hash};
          res.cookie('shortlyid', hash);
          next();
        })
        .catch(err => console.log(err));
    });
};

module.exports.createSession = (req, res, next) => {
  let cookies = req.cookies;

  if (!_.isEmpty(cookies)) {
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then(({hash, userId}) => {
        req.session = {hash: hash, user: {}, userId: userId};
        models.Users.get({id: userId})
          .then(({username}) => {
            req.session.user = {username: username};
            next();
          })
          .catch(() => next());
      })
      .catch(() => {
        createNewSession(req, res, next);
      });
  } else {
    createNewSession(req, res, next);
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.assignSession = (username) => {
  
};

module.exports.verifySession = (req, res, next) => {
  let username = (req.body && req.body.username) || (req.session.user && req.session.user.username);
  return models.Users.get({username: username})
    .then(result => {
console.log(result);
      if (result) {
        if (models.Users.compare(req.body.password, result.password, result.salt)) {
          models.Sessions.update({hash: req.session.hash}, {userId: result.id})
            .then(() => next());
        } else {
          next();
        }
      } else {
        next();
      }
    })
    .catch(() => next()); 
};