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
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
jest.setTimeout(90000);
var __1 = require("../");
var maci_crypto_1 = require("maci-crypto");
var maci_domainobjs_1 = require("maci-domainobjs");
describe('Decryption circuit', function () {
    var circuit;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/decrypt_test.circom')];
                case 1:
                    circuit = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should decrypt a message inside the snark', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keypair, keypair2, sharedKey, cmd, i, msg, circuitInputs, witness, i, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keypair = new maci_domainobjs_1.Keypair();
                    keypair2 = new maci_domainobjs_1.Keypair();
                    sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(keypair.privKey, keypair2.pubKey);
                    cmd = [];
                    for (i = 0; i < 5; i++) {
                        cmd.push(maci_crypto_1.genRandomSalt());
                    }
                    msg = maci_crypto_1.encrypt(cmd, sharedKey);
                    circuitInputs = maci_crypto_1.stringifyBigInts({
                        'private_key': sharedKey,
                        'message': __spreadArrays([msg.iv], msg.data)
                    });
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                case 1:
                    witness = _a.sent();
                    for (i = 0; i < 4; i++) {
                        out = __1.getSignalByName(circuit, witness, 'main.out[' + i + ']').toString();
                        expect(out.toString()).toEqual(cmd[i].toString());
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=Decrypt.test.js.map