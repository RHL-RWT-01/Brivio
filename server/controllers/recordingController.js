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
exports.processing = exports.getAllRecordings = exports.getRecordingById = exports.createRecording = void 0;
var multer_1 = require("multer");
var fsp = require("fs/promises");
var recordingModel_js_1 = require("../models/recordingModel.js");
var getDuration_js_1 = require("../utils/getDuration.js");
var redisQueue_js_1 = require("../utils/redisQueue.js");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "".concat(Date.now(), "-").concat(file.originalname));
    },
});
var upload = (0, multer_1.default)({ storage: storage });
var createRecording = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, alreadyProcessing, duration, MAX_DURATION_SECONDS, newRecording, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, recordingModel_js_1.Recording.findOne({
                        user: userId,
                        status: "processing",
                    })];
            case 1:
                alreadyProcessing = _b.sent();
                if (alreadyProcessing) {
                    res.status(409).json({
                        error: "A recording is already being processed. Please wait.",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        upload.single("recording")(req, res, function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    })];
            case 2:
                _b.sent();
                if (!req.file) {
                    res.status(400).json({ error: "No file uploaded." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, getDuration_js_1.getAudioDuration)(req.file.path)];
            case 3:
                duration = _b.sent();
                console.log("Audio duration is:", duration);
                MAX_DURATION_SECONDS = 60 * 10;
                if (!(duration > MAX_DURATION_SECONDS)) return [3 /*break*/, 5];
                return [4 /*yield*/, fsp.unlink(req.file.path)];
            case 4:
                _b.sent();
                res
                    .status(400)
                    .json({ error: "Audio duration must not exceed 10 minutes." });
                return [2 /*return*/];
            case 5:
                newRecording = new recordingModel_js_1.Recording({
                    user: userId,
                    filePath: req.file.path,
                    status: "uploaded",
                    duration: duration,
                });
                return [4 /*yield*/, newRecording.save()];
            case 6:
                _b.sent();
                console.log("New recording created:", newRecording._id);
                return [4 /*yield*/, (0, redisQueue_js_1.addJob)({ recordingId: newRecording._id.toString() })];
            case 7:
                _b.sent();
                console.log("Job added to processing queue for recording:", newRecording._id);
                res.status(202).json({
                    message: "Recording uploaded successfully and is being processed.",
                    recordingId: newRecording._id,
                });
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                console.error("Error in createRecording controller:", error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createRecording = createRecording;
var getRecordingById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recordingId, recording, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user || !req.user._id) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                recordingId = req.params.id;
                return [4 /*yield*/, recordingModel_js_1.Recording.findOne({
                        _id: recordingId,
                        user: req.user._id,
                    })];
            case 1:
                recording = _a.sent();
                if (!recording) {
                    res
                        .status(404)
                        .json({ error: "Recording not found or is still processing." });
                    return [2 /*return*/];
                }
                res.status(200).json(recording);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching single recording:", error_2);
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRecordingById = getRecordingById;
var getAllRecordings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, page, limit, recordings, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
                page = parseInt(req.query.page || "1", 10);
                limit = parseInt(req.query.limit || "20", 10);
                return [4 /*yield*/, recordingModel_js_1.Recording.find({
                        status: "completed",
                    })
                        .select("status title duration createdAt")
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit)];
            case 1:
                recordings = _b.sent();
                res.status(200).json({ recordings: recordings });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Error fetching recordings:", error_3);
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllRecordings = getAllRecordings;
var processing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, recording, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, recordingModel_js_1.Recording.find({
                        user: userId,
                        status: "processing",
                    })];
            case 1:
                recording = _b.sent();
                if (recording && recording.length > 0) {
                    res.status(200).json({
                        error: "Your last recording is processing, You have to wait to upload new recording",
                        recording: recording,
                    });
                    return [2 /*return*/];
                }
                res
                    .status(200)
                    .json({ message: "No recording is currently being processed." });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error("Error fetching processing recordings:", error_4);
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.processing = processing;
