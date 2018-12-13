const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// import user schema
const User = require('../models/user');


// create new user
router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                //it will return empty array, not null, so we must check for the length
                res.status(409).json({ //409 mean conflict
                    message: 'User already exist!'
                });
            } else {
                // run hashing process
                // hash the password first
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        // then call callback function to save to DB if succeed hashing
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ message: 'User created!' });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
});


// login user and give JWT token
router.post('/login', (req, res, next) => {
    // check if email exist
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
                //if there is no user, send error
                return res.status(401).json({ message: 'Email/password wrong!'});
            }

            //if exist, compare the password
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    //if not same
                    return res.status(401).json({ message: 'Email/password wrong!'});
                }
                if(result){
                    //if same, sign new jsonwebtoken
                    const token = jwt.sign(
                        //first params is payload/data
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        //second is secret key
                            process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({ 
                        message: 'Success login!',
                        token: token
                    });
                }

                // any else
                return res.status(401).json({ message: 'Email/password wrong!'});
            });
        })
})

// delete user
router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({ message: "User deleted!" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});

module.exports = router;