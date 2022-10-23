const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const joi = require("joi");


const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
        unique: true,
    },
    pasword: {
        type: String,
        required: true,
    },
})

const joiUserSchema = joi.object({
    _id: joi.any(),
    name: joi.string().min(2).max(20).required(),
    user_name: joi.string().min(3).max(7).required().alphanum(),
    pasword: joi.string().min(7),
})

userSchema.pre("save", async function (next) {
    const { error } = joiUserSchema.validate(this._doc);
    if (error) throw error;
    const RDBO = await module.exports.findOne({
        _id: this._id
    });
    if (!RDBO || RDBO.pasword !== this.pasword)
        this.pasword = await bcrypt.hash(this.pasword, 12);
    next();
})



module.exports = new mongoose.model('user', userSchema);