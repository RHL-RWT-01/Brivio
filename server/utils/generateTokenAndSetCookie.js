"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookie = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateTokenAndSetCookie = function (id, res) {
    var isProduction = process.env.NODE_ENV === "production";
    var jwtSecret = process.env.JWT_SECRET || "";
    var token = jsonwebtoken_1.default.sign({ userId: id }, jwtSecret, {
        expiresIn: "15d",
    });
    res.cookie("jwt", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
