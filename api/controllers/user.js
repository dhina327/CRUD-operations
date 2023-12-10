const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwtToken = require('jsonwebtoken');

const User = require('../models/users');

exports.user_signup = (req, res, next) => {
 
    User.find({ email: req.body.email })
    .exec()
    .then(docs => {
        if(docs.length >= 1){
            res.status(404).json({
                message:'User Already Exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        message: err
                    });
                }else{

                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        res.status(202).json({
                            message: "User Created Successfully"
                        });
                    })
                    .catch(err => {
                        res.status(404).json({
                            Error:err
                        })
                    })
                }
            })
        }
    })

};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        console.log(user);
        if(user.length < 1){
            return res.status(401).json({
                message:'Auth Fail'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message:"Auth Fail"
                });
            }
            if(result){
               const token = jwtToken.sign({
                    email:user[0].email,
                    userId:user[0]._id
                },
                'SECRET',
                {
                    expiresIn:'1hr'
                }
                )
                return res.status(200).json({
                    message:'Auth SuccessFully',
                    token: token,
                    id:user[0]._id
                });
            }
            res.status(401).json({
                message:"Auth Fail"
            });
        });

    })
    .catch(err => {
        res.status(500).json({
            Error:err
        });
    })
};

exports.user_delete = (req, res, next) => {
    const userId = req.params.userId;
    User.deleteOne({ _id: userId })
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message: 'User Successfully Deleted'
            })
        }else{
            res.status(404).json({
                message:"User Not Found" 
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message:err
        })
    })

};