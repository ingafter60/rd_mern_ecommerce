const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    console.log("req.body", req.body);
    const user = new User(req.body); // create new user from what we got from the request body
    user.save((err, user) => { // get error or save user to db
        if (err) { // if error
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({ // response (with json) after saving the newly users
            user
        });
    });
};
