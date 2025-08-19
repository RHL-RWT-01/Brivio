"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.signup = void 0;
var bcryptjs_1 = require("bcryptjs");
var userModel_js_1 = require("../models/userModel.js");
var generateTokenAndSetCookie_js_1 = require("../utils/generateTokenAndSetCookie.js");
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, emailRegex, existingEmail, salt, hashedPassword, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password;
                if (!fullName || !email || !password) {
                    res.status(400).json({ error: "All fields are required" });
                    return [2 /*return*/];
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({ error: "Invalid email format" });
                    return [2 /*return*/];
                }
                if (password.length < 6) {
                    res
                        .status(400)
                        .json({ error: "Password must be at least 6 characters long" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, userModel_js_1.default.findOne({ email: email })];
            case 1:
                existingEmail = _b.sent();
                if (existingEmail) {
                    res.status(400).json({ error: "Email already exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 3:
                hashedPassword = _b.sent();
                newUser = new userModel_js_1.default({
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                });
                if (!newUser) return [3 /*break*/, 5];
                (0, generateTokenAndSetCookie_js_1.generateTokenAndSetCookie)(newUser._id, res);
                return [4 /*yield*/, newUser.save()];
            case 4:
                _b.sent();
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                });
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ error: "Invalid user data" });
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.log("Error in signup controller", error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordCorrect, _b, error_2, errorMessage;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    res.status(400).json({ error: "Email and password are required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, userModel_js_1.default.findOne({ email: email }).select("+password")];
            case 1:
                user = (_c.sent());
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                _b = _c.sent();
                return [3 /*break*/, 4];
            case 3:
                _b = false;
                _c.label = 4;
            case 4:
                isPasswordCorrect = _b;
                if (!user || !isPasswordCorrect) {
                    res.status(400).json({ error: "Invalid email or password" });
                    return [2 /*return*/];
                }
                (0, generateTokenAndSetCookie_js_1.generateTokenAndSetCookie)(user._id, res);
                console.log("User logged in:", user.email);
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _c.sent();
                errorMessage = error_2 instanceof Error ? error_2.message : "Internal Server Error";
                console.log("Error in login controller", errorMessage);
                res.status(500).json({ error: errorMessage });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var getMe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, userModel_js_1.default.findById(userId).select("-password")];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.log("Error in getMe controller", error_3.message);
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMe = getMe;
