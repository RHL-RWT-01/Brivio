import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });
};