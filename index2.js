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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
var baileys_1 = require("@adiwajshing/baileys");
var adhan_1 = require("adhan");
var moment_timezone_1 = require("moment-timezone");
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)('auth')];
                case 1:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        // can provide additional config here
                        printQRInTerminal: true,
                        auth: state
                    });
                    sock.ev.on('creds.update', saveCreds);
                    sock.ev.on('connection.update', function (update) {
                        var _a, _b;
                        var connection = update.connection, lastDisconnect = update.lastDisconnect;
                        if (connection === 'close') {
                            var shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                            console.log('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
                            // reconnect if not logged out
                            if (shouldReconnect) {
                                connectToWhatsApp();
                            }
                        }
                        else if (connection === 'open') {
                            console.log('opened connection');
                        }
                    });
                    sock.ev.on('messages.upsert', function (m) { return __awaiter(_this, void 0, void 0, function () {
                        var msg, latitude, longutide, coordinates, params, date, prayerTimes;
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    msg = m.messages[0];
                                    if (!(!msg.key.fromMe && m.type === 'notify')) return [3 /*break*/, 4];
                                    if (!((_a = msg.message) === null || _a === void 0 ? void 0 : _a.locationMessage)) return [3 /*break*/, 2];
                                    latitude = (_c = (_b = msg.message) === null || _b === void 0 ? void 0 : _b.locationMessage) === null || _c === void 0 ? void 0 : _c.degreesLatitude;
                                    longutide = (_e = (_d = msg.message) === null || _d === void 0 ? void 0 : _d.locationMessage) === null || _e === void 0 ? void 0 : _e.degreesLongitude;
                                    coordinates = new adhan_1.Coordinates(latitude, longutide);
                                    params = adhan_1.CalculationMethod.MoonsightingCommittee();
                                    date = new Date();
                                    prayerTimes = new adhan_1.PrayerTimes(coordinates, date, params);
                                    console.log(prayerTimes);
                                    return [4 /*yield*/, sock.sendMessage(msg.key.remoteJid, { text: processData(prayerTimes) })];
                                case 1:
                                    _f.sent();
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, sock.sendMessage(msg.key.remoteJid, { text: "This is bot for rermind the time of worship \n                                                                   \n\n you can share your location for get shalat schedule in your area\n                                                                   \n\n and you can also type : /\"your_religion\"\n to get some quotes and motivation\n                                                                   \n example : /islam, /kristen\n                                                                   \n\n if you interesting for this bot you can donate for support developer to develop this bot\n                                                                   \n\n https://saweria.co/hamaay" })];
                                case 3:
                                    _f.sent();
                                    _f.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function processData(data) {
    return "time for shalat, today \n\n \n            \n            subuh : ".concat(processTime(data.fajr), "\n \n            Duha : ").concat(processTime(data.sunrise), "\n \n            Dzuhur : ").concat(processTime(data.dhuhr), "\n \n            ashar : ").concat(processTime(data.asr), "\n \n            maghrib : ").concat(processTime(data.maghrib), "\n \n            isha : ").concat(processTime(data.isha), " ");
}
function processTime(time) {
    return (0, moment_timezone_1["default"])(time)
        .tz('Asia/Jakarta')
        .format('HH:mm') + " WIB";
}
connectToWhatsApp();
