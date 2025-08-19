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
exports.getJob = exports.addJob = void 0;
exports.connectRedis = connectRedis;
var redis_1 = require("redis");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.on("error", function (err) { return console.log("Redis Client Error", err); });
function connectRedis() {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    console.log("Redis client connected.");
                    resolve();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to connect to Redis: ".concat(error_1.message));
                    reject(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
var queueName = "audio-processing-jobs";
var addJob = function (jobData) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Adding job to Redis queue: ".concat(JSON.stringify(jobData)));
                if (!jobData || !jobData.recordingId) {
                    throw new Error("Invalid job data provided");
                }
                return [4 /*yield*/, client.lPush(queueName, JSON.stringify(jobData))];
            case 1:
                _a.sent(); // [(lPush + lpop)->FIFO       (lPush + lPop)->LIFO ] pooling
                console.log("Job added to Redis queue: ".concat(JSON.stringify(jobData)));
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Failed to add job to Redis queue:", error_2);
                throw new Error("Failed to add job to Redis queue: " + error_2.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addJob = addJob;
var getJob = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, client.blPop(queueName, 0)];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, JSON.parse(result.element)];
                }
                throw new Error("No job found in Redis queue");
            case 2:
                error_3 = _a.sent();
                console.error("Failed to get job from Redis queue:", error_3);
                throw new Error("Failed to get job from Redis queue: " + error_3.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getJob = getJob;
