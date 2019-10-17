const jsonPatch = require('jsonpatch');
const imageThumbnail = require('image-thumbnail');
const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function(req, res, next) {

        let username = req.body.username;
        let password = req.body.password;

        //check if the request params has null values
        if(username === null || username === undefined || username === '') {
            res.json({code: 3, status: 'fail', message: 'username missing!!!'});
        }else if(password === null || password === undefined || password === '') {
            res.json({code: 3, status: 'fail', message: 'password missing!!!'});
        }else {
            userModel.create({ username: req.body.username, password: req.body.password }, function (err, result) {
                if (err)
                    next(err);
                else
                    res.json({code: 0, status: 'success', message: 'User added successfully!!!'});

            });
        }
    },

    authenticate: function(req, res, next) {
        userModel.findOne({username: req.body.username}, function(err, userInfo){
            if (err) {
                next(err);
            } else {

                if(userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {

                    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });

                    res.json({status: 'success', message: 'user found!!!', data: {user: userInfo, token: token}});

                }else{

                    res.json({status: 'error', message: 'Invalid username/password!!!', data: null});

                }
            }
        });
    },

    getAll: function(req, res, next) {
        userModel.find({}, function(err, u){
            if(err){
                next(err);
            }
            else {
                res.json(u);
            }
        });
    },

    doPatch: function(req, res, next) {
        let thePatch = [
            { 'op': 'replace', 'path': '/message', 'value': 'hacker Bay' }
        ];
        let patchedDoc = jsonPatch.apply_patch(req.body, thePatch);
        res.json(patchedDoc);
    },

    generate: function() {

    }

};