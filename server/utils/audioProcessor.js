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
exports.processAudioJob = void 0;
var fsp = require("fs/promises");
var fs = require("fs");
var sdk_1 = require("@deepgram/sdk");
var openai_1 = require("openai");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var recordingModel_js_1 = require("../models/recordingModel.js");
var deepgramApiKey = process.env.DEEPGRAM_API_KEY;
if (!deepgramApiKey) {
    throw new Error("DEEPGRAM_API_KEY environment variable is not set.");
}
var deepgram = (0, sdk_1.createClient)(deepgramApiKey);
var openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
}
var openai = new openai_1.default({
    apiKey: openaiApiKey,
});
var getTranscription = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var audioSource, options, _a, result, error, transcript, err_1;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                audioSource = fs.createReadStream(filePath);
                options = { model: "nova-2" };
                return [4 /*yield*/, deepgram.listen.prerecorded.transcribeFile(audioSource, options)];
            case 1:
                _a = (_g.sent()), result = _a.result, error = _a.error;
                if (error) {
                    console.error("Error during Deepgram transcription:", error);
                    throw new Error("Transcription failed.");
                }
                transcript = (_f = (_e = (_d = (_c = (_b = result === null || result === void 0 ? void 0 : result.results) === null || _b === void 0 ? void 0 : _b.channels) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.alternatives) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.transcript;
                if (!transcript) {
                    throw new Error("Deepgram returned no transcript.");
                }
                return [2 /*return*/, transcript];
            case 2:
                err_1 = _g.sent();
                console.error("Error in getTranscription:", err_1);
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAiSummary = function (transcript) { return __awaiter(void 0, void 0, void 0, function () {
    var completion, jsonContent, jsonResponse, err_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: "You are a helpful assistant that generates a concise summary and a creative, relevant title for an audio transcript. The response must be a JSON object with 'title' and 'summary' keys.",
                            },
                            {
                                role: "user",
                                content: "Here is the audio transcript: \"".concat(transcript, "\""),
                            },
                        ],
                        response_format: { type: "json_object" },
                    })];
            case 1:
                completion = _c.sent();
                jsonContent = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
                if (!jsonContent) {
                    throw new Error("OpenAI returned no content.");
                }
                jsonResponse = JSON.parse(jsonContent);
                return [2 /*return*/, {
                        title: jsonResponse.title,
                        summary: jsonResponse.summary,
                    }];
            case 2:
                err_2 = _c.sent();
                console.error("Error during OpenAI summarization:", err_2);
                throw new Error("Summarization failed.");
            case 3: return [2 /*return*/];
        }
    });
}); };
var processAudioJob = function (recordingId) { return __awaiter(void 0, void 0, void 0, function () {
    var recording, transcript, _a, title, summary, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                recording = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 11]);
                return [4 /*yield*/, recordingModel_js_1.Recording.findById(recordingId)];
            case 2:
                recording = _b.sent();
                console.log("Found recording:", recording);
                if (!recording) {
                    console.log("Recording with ID ".concat(recordingId, " not found. Skipping job."));
                    return [2 /*return*/];
                }
                if (recording.status === "processing") {
                    console.log("Recording ".concat(recordingId, " is already being processed. Skipping job."));
                    return [2 /*return*/];
                }
                console.log("Recording ".concat(recordingId, " is not being processed. Starting job."));
                recording.status = "processing";
                return [4 /*yield*/, recording.save()];
            case 3:
                _b.sent();
                console.log("Started processing job for recording: ".concat(recordingId));
                return [4 /*yield*/, getTranscription(recording.filePath)];
            case 4:
                transcript = _b.sent();
                console.log("Transcription complete for recording: ".concat(recordingId));
                return [4 /*yield*/, getAiSummary(transcript)];
            case 5:
                _a = _b.sent(), title = _a.title, summary = _a.summary;
                console.log("AI summary complete for recording: ".concat(recordingId));
                recording.originalTranscript = transcript;
                recording.title = title;
                recording.aiSummary = summary;
                recording.status = "completed";
                return [4 /*yield*/, recording.save()];
            case 6:
                _b.sent();
                console.log("Recording ".concat(recordingId, " processed successfully."));
                return [4 /*yield*/, fsp.unlink(recording.filePath)];
            case 7:
                _b.sent();
                console.log("Successfully processed and cleaned up recording: ".concat(recordingId));
                return [3 /*break*/, 11];
            case 8:
                error_1 = _b.sent();
                console.error("Failed to process recording ".concat(recordingId, ":"), error_1.message);
                if (!recording) return [3 /*break*/, 10];
                recording.status = "failed";
                return [4 /*yield*/, recording.save()];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: throw new Error("Failed to process recording ".concat(recordingId, ": ").concat(error_1.message));
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.processAudioJob = processAudioJob;
