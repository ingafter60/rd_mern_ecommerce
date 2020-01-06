const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: 32
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual("password") // sending pwd from the client side
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1(); // import the uuid package to hash the pwd
        this.hashed_password = this.encryptPassword(password);  // encrypt the pwd
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    
    encryptPassword: function(password) {
        if (!password) return ""; // if there is no pwd
        try { // if there is pwd
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) { // if there is error
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);