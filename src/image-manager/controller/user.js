const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userModel = require("../model/user");

const JWT_SECRET = process.env.JWT_SECRET || "my amazing secret";


exports.signin = async (req, res, next) => {
    let { userName, password } = req.body;
    const dbuser = userModel.findOne({
        user_name: userName,
    }, { __v: 0 });

    const valid = await bcrypt.compare(password, dbuser.password);
    if (!valid) return res.status(402).json({
        ok: false, message: "Incorrect Username or password",
    });
    jwt.sign({ _id: dbuser._id }, JWT_SECRET,
        { expiresIn: "1h" }, (err, token) => {
            if (err) return res.status(500).json({
                ok: false, message: err.message,
            });
            res.status(200).json({
                token, message: "success",
                ok: true,
            });
        });
};

exports.gard = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
    } catch (e) {
        return res.status(403).json({
            ok: false, message: e.message,
        })
    };
    jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) return res.status(403).json({
            ok: false, message: err.message,
        });
        req.user_id = data._id;
    });
}