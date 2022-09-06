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
exports.__esModule = true;
jest.setTimeout(90000);
var maci_crypto_1 = require("maci-crypto");
var maci_domainobjs_1 = require("maci-domainobjs");
var __1 = require("../");
var circuitName = 'test/verifySignature_test.circom';
describe('Signature verification circuit', function () {
    it('verifies a valid signature', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keypair, command, signer, sig, plaintext, circuitInputs, circuit, witness, isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keypair = new maci_domainobjs_1.Keypair();
                    command = new maci_domainobjs_1.Command(BigInt(0), keypair.pubKey, BigInt(123), BigInt(123), BigInt(1));
                    signer = new maci_domainobjs_1.Keypair();
                    sig = command.sign(signer.privKey);
                    plaintext = maci_crypto_1.hash11(command.asArray());
                    expect(maci_crypto_1.verifySignature(plaintext, sig, signer.pubKey.rawPubKey)).toBeTruthy();
                    circuitInputs = maci_crypto_1.stringifyBigInts({
                        'from_x': maci_crypto_1.stringifyBigInts(signer.pubKey.rawPubKey[0]),
                        'from_y': maci_crypto_1.stringifyBigInts(signer.pubKey.rawPubKey[1]),
                        'R8x': maci_crypto_1.stringifyBigInts(sig.R8[0]),
                        'R8y': maci_crypto_1.stringifyBigInts(sig.R8[1]),
                        'S': maci_crypto_1.stringifyBigInts(sig.S),
                        'preimage': maci_crypto_1.stringifyBigInts(command.asArray())
                    });
                    return [4 /*yield*/, __1.compileAndLoadCircuit(circuitName)];
                case 1:
                    circuit = _a.sent();
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                case 2:
                    witness = _a.sent();
                    isValid = __1.getSignalByName(circuit, witness, 'main.valid').toString();
                    expect(isValid).toEqual('1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects an invalid signature', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keypair, command, signer, wrongSigner, sig, plaintext, circuitInputs, circuit, witness, isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keypair = new maci_domainobjs_1.Keypair();
                    command = new maci_domainobjs_1.Command(BigInt(0), keypair.pubKey, BigInt(123), BigInt(123), BigInt(1));
                    signer = new maci_domainobjs_1.Keypair();
                    wrongSigner = new maci_domainobjs_1.Keypair();
                    expect(signer.privKey.rawPrivKey).not.toEqual(wrongSigner.privKey.rawPrivKey);
                    sig = command.sign(signer.privKey);
                    plaintext = maci_crypto_1.hash11(command.asArray());
                    // The signature is signed by `signer`
                    expect(maci_crypto_1.verifySignature(plaintext, sig, signer.pubKey.rawPubKey)).toBeTruthy();
                    // The signature is not signed by `wrongSigner`
                    expect(maci_crypto_1.verifySignature(plaintext, sig, wrongSigner.pubKey.rawPubKey)).toBeFalsy();
                    circuitInputs = maci_crypto_1.stringifyBigInts({
                        'from_x': wrongSigner.pubKey.rawPubKey[0],
                        'from_y': wrongSigner.pubKey.rawPubKey[1],
                        'R8x': sig.R8[0],
                        'R8y': sig.R8[1],
                        'S': sig.S,
                        'preimage': command.asArray()
                    });
                    return [4 /*yield*/, __1.compileAndLoadCircuit(circuitName)];
                case 1:
                    circuit = _a.sent();
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                case 2:
                    witness = _a.sent();
                    isValid = __1.getSignalByName(circuit, witness, 'main.valid').toString();
                    expect(isValid).toEqual('0');
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects an invalid signature (invalid pubkey)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keypair, command, signer, sig, plaintext, circuitInputs, circuit, witness, isValid, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keypair = new maci_domainobjs_1.Keypair();
                    command = new maci_domainobjs_1.Command(BigInt(0), keypair.pubKey, BigInt(123), BigInt(123), BigInt(1));
                    signer = new maci_domainobjs_1.Keypair();
                    sig = command.sign(signer.privKey);
                    plaintext = maci_crypto_1.hash11(command.asArray());
                    // The signature is signed by `signer`
                    expect(maci_crypto_1.verifySignature(plaintext, sig, signer.pubKey.rawPubKey)).toBeTruthy();
                    circuitInputs = maci_crypto_1.stringifyBigInts({
                        'from_x': 0,
                        'from_y': 1,
                        'R8x': sig.R8[0],
                        'R8y': sig.R8[1],
                        'S': sig.S,
                        'preimage': command.asArray()
                    });
                    return [4 /*yield*/, __1.compileAndLoadCircuit(circuitName)];
                case 1:
                    circuit = _b.sent();
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                case 2:
                    witness = _b.sent();
                    isValid = __1.getSignalByName(circuit, witness, 'main.valid').toString();
                    expect(isValid).toEqual('0');
                    _a = expect;
                    return [4 /*yield*/, __1.getSignalByName(circuit, witness, 'main.verifier.isCcZero.out')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).toString()]).toEqual('1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects an invalid signature', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keypair, command, signer, sig, plaintext, circuitInputs, circuit, witness, isValid, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keypair = new maci_domainobjs_1.Keypair();
                    command = new maci_domainobjs_1.Command(BigInt(0), keypair.pubKey, BigInt(123), BigInt(123), BigInt(1));
                    signer = new maci_domainobjs_1.Keypair();
                    sig = command.sign(signer.privKey);
                    plaintext = maci_crypto_1.hash11(command.asArray());
                    expect(maci_crypto_1.verifySignature(plaintext, sig, signer.pubKey.rawPubKey)).toBeTruthy();
                    circuitInputs = maci_crypto_1.stringifyBigInts({
                        'from_x': maci_crypto_1.stringifyBigInts(signer.pubKey.rawPubKey[0]),
                        'from_y': maci_crypto_1.stringifyBigInts(signer.pubKey.rawPubKey[1]),
                        'R8x': maci_crypto_1.stringifyBigInts(sig.R8[0]),
                        'R8y': maci_crypto_1.stringifyBigInts(sig.R8[1]),
                        'S': BigInt('2736030358979909402780800718157159386076813972158567259200215660948447373040') + BigInt(1),
                        'preimage': maci_crypto_1.stringifyBigInts(command.asArray())
                    });
                    return [4 /*yield*/, __1.compileAndLoadCircuit(circuitName)];
                case 1:
                    circuit = _b.sent();
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                case 2:
                    witness = _b.sent();
                    isValid = __1.getSignalByName(circuit, witness, 'main.valid').toString();
                    expect(isValid).toEqual('0');
                    _a = expect;
                    return [4 /*yield*/, __1.getSignalByName(circuit, witness, 'main.verifier.isCcZero.out')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).toString()]).toEqual('0');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=VerifySignature.test.js.map