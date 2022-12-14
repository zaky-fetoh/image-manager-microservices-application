const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userModel = require("../model/user");

const JWT_SECRET = process.env.JWT_SECRET || "my amazing secret";


exports.signin = async (req, res, next) => {
    let { user_name, password } = req.body;
    const dbuser = await userModel.findOne({
        user_name: user_name,
    }, { __v: 0 });

    if( !dbuser || !user_name || !password)
        return res.status(404).json({
            ok:false, message: "Not Found"
        });
    
    const valid = await bcrypt.compare(password, dbuser.password,);
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
        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (err) return res.status(403).json({
                ok: false, message: err.message,
            });
            req.user_id = data._id;
            next();
        });
    } catch (e) {
        return res.status(403).json({
            ok: false, message: e.message,
        })
    };
};


exports.addUser = async (req, res, next) => {
    const body = req.body;
    try {console.log(`adding user ${body.name}`)
        let user = await userModel.create(body);
        res.status(200).json({ ok: true, user_id: user._id })
    } catch (e) {
        res.status(500).json({ ok: false, message: e.message, })
    }
};

exports.updateUser = async (req, res, next) => {
    const userId = req.user_id;
    const user = await userModel.findOne({
        _id: userId
    }, { __v: 0 });
    Object.assign(user, req.body);
    try { await user.save(); } catch (e) {
        res.status(500).json({
            ok: false, message: e.message,
        })
    }
    res.status(200).json({
        ok: true, message: "user updated",
    })
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.user_id;
    await userModel.deleteOne({
        _id: userId,
    })
    res.status(200).json({
        ok: true, message: "user deleted",
    });
};

exports.getUser = async (req, res, next) => {
    try{const userId = req.user_id;
    const user = await userModel.findOne({
        _id: userId,
    }, { __v: 0, password: 0 });
    res.status(200).json({
        ok: true, data: user,
    });} catch(e){
        res.status(500).json({
            message: e.message,
            ok:false,
        })
    }
};