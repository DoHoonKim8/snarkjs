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
jest.setTimeout(1200000);
var __1 = require("../");
var maci_core_1 = require("maci-core");
var maci_domainobjs_1 = require("maci-domainobjs");
var maci_crypto_1 = require("maci-crypto");
var maci_config_1 = require("maci-config");
var stateTreeDepth = maci_config_1.config.maci.merkleTrees.stateTreeDepth;
var messageTreeDepth = maci_config_1.config.maci.merkleTrees.messageTreeDepth;
var voteOptionTreeDepth = maci_config_1.config.maci.merkleTrees.voteOptionTreeDepth;
var initialVoiceCreditBalance = maci_config_1.config.maci.initialVoiceCreditBalance;
var voteOptionsMaxIndex = maci_config_1.config.maci.voteOptionsMaxLeafIndex;
var user = new maci_domainobjs_1.Keypair();
var voteOptionIndex = BigInt(0);
var newVoteWeight = BigInt(9);
var nonce = BigInt(1);
var salt = maci_crypto_1.genRandomSalt();
describe('State tree root update verification circuit', function () {
    var circuit;
    var circuitInputs;
    var coordinator = new maci_domainobjs_1.Keypair();
    var maciState = new maci_core_1.MaciState(coordinator, stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, voteOptionsMaxIndex);
    it('UpdateStateTree should produce the correct state root', function () { return __awaiter(void 0, void 0, void 0, function () {
        var command, signature, sharedKey, message, witness, circuitNewStateRoot, stateRootBefore, stateRootAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new maci_domainobjs_1.Command(BigInt(1), user.pubKey, voteOptionIndex, newVoteWeight, nonce, salt);
                    signature = command.sign(user.privKey);
                    sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                    message = command.encrypt(signature, sharedKey);
                    return [4 /*yield*/, __1.compileAndLoadCircuit('test/updateStateTree_test.circom')
                        // Sign up the user
                    ];
                case 1:
                    circuit = _a.sent();
                    // Sign up the user
                    maciState.signUp(user.pubKey, initialVoiceCreditBalance);
                    // Publish a message
                    maciState.publishMessage(message, user.pubKey);
                    // Generate circuit inputs
                    circuitInputs = maciState.genUpdateStateTreeCircuitInputs(0);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Get the circuit-generated root
                    ];
                case 2:
                    witness = _a.sent();
                    circuitNewStateRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                    stateRootBefore = maciState.genStateRoot().toString();
                    // Before we run process the message via maciState.processMessage(),
                    // the root generated by the circuit should not match
                    expect(circuitNewStateRoot).not.toEqual(stateRootBefore.toString());
                    // Process the message
                    maciState.processMessage(0);
                    stateRootAfter = maciState.genStateRoot().toString();
                    expect(stateRootBefore).not.toEqual(stateRootAfter);
                    // After we run process the message via maciState.processMessage(),
                    // the root generated by the circuit should match
                    expect(circuitNewStateRoot).toEqual(stateRootAfter);
                    return [2 /*return*/];
            }
        });
    }); });
    it('UpdateStateTree should produce the same state root (invalid state index)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var command, signature, sharedKey, message, witness, circuitNewStateRoot, stateRootBefore, stateRootAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new maci_domainobjs_1.Command(BigInt(9), user.pubKey, voteOptionIndex, newVoteWeight, nonce, salt);
                    signature = command.sign(user.privKey);
                    sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                    message = command.encrypt(signature, sharedKey);
                    // Publish a message
                    maciState.publishMessage(message, user.pubKey);
                    // Generate circuit inputs
                    circuitInputs = maciState.genUpdateStateTreeCircuitInputs(1);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Get the circuit-generated root
                    ];
                case 1:
                    witness = _a.sent();
                    circuitNewStateRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                    stateRootBefore = maciState.genStateRoot().toString();
                    // Before we run process the message via maciState.processMessage(),
                    // the root generated by the circuit should match
                    expect(circuitNewStateRoot).toEqual(stateRootBefore.toString());
                    // Process the message
                    maciState.processMessage(0);
                    stateRootAfter = maciState.genStateRoot().toString();
                    expect(stateRootBefore).toEqual(stateRootAfter);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=UpdateStateTree.test.js.map