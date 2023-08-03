// const jwt = require("jsonwebtoken");
// const config = require("config");
require("dotenv").config();

// module.exports = async function (req, res, next) {
//     const token = req.header("Authorization");
//     console.log("_______________________________");
//     console.log("in the middlware");
//     console.log(req.header("Authorization"));
//     console.log(req.headers);
//     console.log("_______________________________");
//     if (!token) {
//         return res.status(401).json({ msg: "No Token. Authorization Denied." });
//     }

//     try {
//         const decoded = jwt.verify(token, config.get("jwtSecret"));
//         req.user = decoded.user;
//         next();
//     } catch (error) {
//         res.status(401).json({ msg: "Token is not valid" });
//     }
// };

const jwt = require("jsonwebtoken");

// const config = process.env;

const verifyToken = (req, res, next) => {
    // console.log("in verify token with headers = ", req.headers);
    // let token =
    //     req.body.token || req.query.token || req.headers["authorization"];
    let token = req.headers["x-auth-token"];

    // console.log(
    //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    // );
    // console.log("inside auth middlware");
    // console.log("headers are ");
    // console.log(req.headers);
    // console.log(
    //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    // );

    if (!token) {
        return res.status(401).json({ msg: "No Token. Authorization Denied." });
    }
    try {
        // const decoded = jwt.verify(token, config.get("jwtSecret"));
        const decoded = jwt.verify(token, proces.env.jwtSecret);
        req.user = decoded.user;
        // req.body.user = decoded.user;

        // console.log(
        //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
        // );
        // console.log("req.user is", req.user);
        // console.log(
        //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
        // );

        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token is not valid" });
    }

    return next();
};

module.exports = verifyToken;
