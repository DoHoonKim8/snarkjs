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
var maci_config_1 = require("maci-config");
var maci_core_1 = require("maci-core");
var maci_domainobjs_1 = require("maci-domainobjs");
var maci_crypto_1 = require("maci-crypto");
var batchSize = maci_config_1.config.maci.messageBatchSize;
var stateTreeDepth = maci_config_1.config.maci.merkleTrees.stateTreeDepth;
var messageTreeDepth = maci_config_1.config.maci.merkleTrees.messageTreeDepth;
var voteOptionTreeDepth = maci_config_1.config.maci.merkleTrees.voteOptionTreeDepth;
var voteOptionsMaxIndex = maci_config_1.config.maci.voteOptionsMaxLeafIndex;
var initialVoiceCreditBalance = maci_config_1.config.maci.initialVoiceCreditBalance;
// Set up keypairs
var user = new maci_domainobjs_1.Keypair();
var coordinator = new maci_domainobjs_1.Keypair();
describe('State tree root update verification circuit', function () {
    var circuit;
    var voteWeight = BigInt(2);
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.compileAndLoadCircuit(maci_config_1.config.env === 'test' ?
                        'test/batchUpdateStateTree_test.circom'
                        :
                            'prod/batchUpdateStateTree_small.circom')];
                case 1:
                    circuit = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('BatchUpdateStateTree should produce the correct state root from a partially filled batch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var maciState, stateRootBefore, command, signature, sharedKey, message, randomStateLeaf, circuitInputs, witness, circuitNewStateRoot, stateRootAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    maciState = new maci_core_1.MaciState(coordinator, stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, voteOptionsMaxIndex);
                    // Sign up the user
                    maciState.signUp(user.pubKey, initialVoiceCreditBalance);
                    stateRootBefore = maciState.genStateRoot();
                    command = new maci_domainobjs_1.Command(BigInt(1), user.pubKey, BigInt(0), voteWeight, BigInt(1), maci_crypto_1.genRandomSalt());
                    signature = command.sign(user.privKey);
                    sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                    message = command.encrypt(signature, sharedKey);
                    maciState.publishMessage(message, user.pubKey);
                    randomStateLeaf = maci_domainobjs_1.StateLeaf.genRandomLeaf();
                    circuitInputs = maciState.genBatchUpdateStateTreeCircuitInputs(0, batchSize, randomStateLeaf);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Get the circuit-generated root
                    ];
                case 1:
                    witness = _a.sent();
                    circuitNewStateRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                    // Process the batch of messages
                    maciState.batchProcessMessage(0, batchSize, randomStateLeaf);
                    stateRootAfter = maciState.genStateRoot();
                    expect(stateRootBefore.toString()).not.toEqual(stateRootAfter);
                    // After we run process the message via maciState.processMessage(),
                    // the root generated by the circuit should match
                    expect(circuitNewStateRoot.toString()).toEqual(stateRootAfter.toString());
                    return [2 /*return*/];
            }
        });
    }); });
    it('BatchUpdateStateTree should produce the correct state root from a full batch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var randomStateLeaf, maciState, stateRootBefore, messages, i, voteWeight_1, command, signature, sharedKey, message, copiedState, circuitInputs, witness, circuitNewStateRoot, stateRootAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomStateLeaf = maci_domainobjs_1.StateLeaf.genRandomLeaf();
                    maciState = new maci_core_1.MaciState(coordinator, stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, voteOptionsMaxIndex);
                    // Sign up the user
                    maciState.signUp(user.pubKey, initialVoiceCreditBalance);
                    stateRootBefore = maciState.genStateRoot();
                    messages = [];
                    for (i = 0; i < batchSize - 1; i++) {
                        voteWeight_1 = BigInt(i + 1);
                        command = new maci_domainobjs_1.Command(BigInt(1), user.pubKey, BigInt(0), voteWeight_1, BigInt(i + 1), maci_crypto_1.genRandomSalt());
                        signature = command.sign(user.privKey);
                        sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                        message = command.encrypt(signature, sharedKey);
                        messages.push(message);
                        maciState.publishMessage(message, user.pubKey);
                    }
                    copiedState = maciState.copy();
                    copiedState.batchProcessMessage(0, batchSize, randomStateLeaf);
                    expect(copiedState.users[0].voiceCreditBalance.toString())
                        .toEqual((initialVoiceCreditBalance - 1).toString());
                    console.log(copiedState.genStateRoot());
                    circuitInputs = maciState.genBatchUpdateStateTreeCircuitInputs(0, batchSize, randomStateLeaf);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Get the circuit-generated root
                    ];
                case 1:
                    witness = _a.sent();
                    circuitNewStateRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                    // Process the batch of messages
                    maciState.batchProcessMessage(0, batchSize, randomStateLeaf);
                    stateRootAfter = maciState.genStateRoot();
                    expect(stateRootBefore.toString()).not.toEqual(stateRootAfter);
                    // After we run process the message via maciState.processMessage(),
                    // the root generated by the circuit should match
                    expect(circuitNewStateRoot.toString()).toEqual(stateRootAfter.toString());
                    return [2 /*return*/];
            }
        });
    }); });
    it('BatchUpdateStateTree should produce the correct state root from one and a half batches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var randomStateLeaf, maciState, stateRootBefore, messages, i, voteWeight_2, command, signature, sharedKey, message, numAssertions, x, i, circuitInputs, witness, circuitNewStateRoot, stateRootAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomStateLeaf = maci_domainobjs_1.StateLeaf.genRandomLeaf();
                    maciState = new maci_core_1.MaciState(coordinator, stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, voteOptionsMaxIndex);
                    // Sign up the user
                    maciState.signUp(user.pubKey, initialVoiceCreditBalance);
                    stateRootBefore = maciState.genStateRoot();
                    messages = [];
                    for (i = 0; i < batchSize + Math.floor(batchSize / 2); i++) {
                        voteWeight_2 = BigInt(i + 1);
                        command = new maci_domainobjs_1.Command(BigInt(1), user.pubKey, BigInt(0), voteWeight_2, BigInt(i + 1), maci_crypto_1.genRandomSalt());
                        signature = command.sign(user.privKey);
                        sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                        message = command.encrypt(signature, sharedKey);
                        messages.push(message);
                        maciState.publishMessage(message, user.pubKey);
                    }
                    numAssertions = 0;
                    x = Math.floor(maciState.messages.length / batchSize);
                    i = x * batchSize;
                    _a.label = 1;
                case 1:
                    if (!(i >= 0)) return [3 /*break*/, 4];
                    circuitInputs = maciState.genBatchUpdateStateTreeCircuitInputs(i, batchSize, randomStateLeaf);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Get the circuit-generated root
                    ];
                case 2:
                    witness = _a.sent();
                    circuitNewStateRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                    // Process the batch of messages
                    maciState.batchProcessMessage(i, batchSize, randomStateLeaf);
                    stateRootAfter = maciState.genStateRoot();
                    expect(stateRootBefore.toString()).not.toEqual(stateRootAfter);
                    expect(circuitNewStateRoot.toString()).toEqual(stateRootAfter.toString());
                    numAssertions += 2;
                    _a.label = 3;
                case 3:
                    i -= batchSize;
                    return [3 /*break*/, 1];
                case 4:
                    expect.assertions(numAssertions);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=BatchUpdateStateTree.test.js.map