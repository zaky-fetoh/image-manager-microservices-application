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
    password: {
        type: String,
        required: true,
    },
})

const joiUserSchema = joi.object({
    name: joi.string().min(2).max(20).required(),
    user_name: joi.string().min(3).max(7).required().alphanum(),
    password: joi.string().min(7),
    _id: joi.any(),
})

userSchema.pre("save", async function (next) {
    const { error } = joiUserSchema.validate(this._doc);
    if (error) throw error;
    const RDBO = await module.exports.findOne({
        _id: this._id
    });
    if (!RDBO || RDBO.password !== this.password)
        this.password = await bcrypt.hash(this.password, 12);
    next();
})


module.exports = new mongoose.model('user', userSchema);