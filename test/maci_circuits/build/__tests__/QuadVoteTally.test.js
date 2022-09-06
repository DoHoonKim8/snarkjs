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
jest.setTimeout(200000);
var maci_config_1 = require("maci-config");
var maci_core_1 = require("maci-core");
var maci_crypto_1 = require("maci-crypto");
var maci_domainobjs_1 = require("maci-domainobjs");
var __1 = require("../");
var stateTreeDepth = maci_config_1.config.maci.merkleTrees.stateTreeDepth;
var messageTreeDepth = maci_config_1.config.maci.merkleTrees.messageTreeDepth;
var voteOptionTreeDepth = maci_config_1.config.maci.merkleTrees.voteOptionTreeDepth;
var initialVoiceCreditBalance = maci_config_1.config.maci.initialVoiceCreditBalance;
var voteOptionsMaxIndex = maci_config_1.config.maci.voteOptionsMaxLeafIndex;
var quadVoteTallyBatchSize = maci_config_1.config.maci.quadVoteTallyBatchSize;
var randomRange = function (min, max) {
    return BigInt(Math.floor(Math.random() * (max - min) + min));
};
var coordinator = new maci_domainobjs_1.Keypair();
var voteWeight = BigInt(9);
describe('Quadratic vote tallying circuit', function () {
    var circuit;
    var maciState = new maci_core_1.MaciState(coordinator, stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, voteOptionsMaxIndex);
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/quadVoteTally_test.circom')];
                case 1:
                    circuit = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should correctly tally results for 1 user with 1 message in 1 batch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var startIndex, user, voteOptionIndex, command, signature, sharedKey, message, currentResults, i, tally, currentResultsSalt, newResultsSalt, currentSpentVoiceCreditsSalt, newSpentVoiceCreditsSalt, currentPerVOSpentVoiceCreditsCommitment, newPerVOSpentVoiceCreditsSalt, circuitInputs, witness, expectedResultsCommitmentOutput, expectedResultsCommitment, expectedSpentVoiceCreditsCommitmentOutput, expectedSpentVoiceCreditsCommitment, perVOSpentVoiceCredits, expectedPerVOSpentVoiceCreditsCommitment, expectedPerVOSpentVoiceCreditsCommitmentOutput, totalVotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startIndex = BigInt(0);
                    user = new maci_domainobjs_1.Keypair();
                    // Sign up the user
                    maciState.signUp(user.pubKey, initialVoiceCreditBalance);
                    voteOptionIndex = randomRange(0, voteOptionsMaxIndex);
                    command = new maci_domainobjs_1.Command(BigInt(1), user.pubKey, voteOptionIndex, voteWeight, BigInt(1), maci_crypto_1.genRandomSalt());
                    signature = command.sign(user.privKey);
                    sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(user.privKey, coordinator.pubKey);
                    message = command.encrypt(signature, sharedKey);
                    // Publish a message
                    maciState.publishMessage(message, user.pubKey);
                    // Process the message
                    maciState.processMessage(0);
                    currentResults = maciState.computeCumulativeVoteTally(startIndex, quadVoteTallyBatchSize);
                    // Ensure that the current results are all 0 since this is the first
                    // batch
                    for (i = 0; i < currentResults.length; i++) {
                        expect(currentResults[i].toString()).toEqual(BigInt(0).toString());
                    }
                    tally = maciState.computeBatchVoteTally(startIndex, quadVoteTallyBatchSize);
                    expect(tally.length.toString()).toEqual((Math.pow(5, voteOptionTreeDepth)).toString());
                    expect(tally[voteOptionIndex].toString()).toEqual(voteWeight.toString());
                    currentResultsSalt = BigInt(0);
                    newResultsSalt = maci_crypto_1.genRandomSalt();
                    currentSpentVoiceCreditsSalt = BigInt(0);
                    newSpentVoiceCreditsSalt = maci_crypto_1.genRandomSalt();
                    currentPerVOSpentVoiceCreditsCommitment = BigInt(0);
                    newPerVOSpentVoiceCreditsSalt = maci_crypto_1.genRandomSalt();
                    circuitInputs = maciState.genQuadVoteTallyCircuitInputs(startIndex, quadVoteTallyBatchSize, currentResultsSalt, newResultsSalt, currentSpentVoiceCreditsSalt, newSpentVoiceCreditsSalt, currentPerVOSpentVoiceCreditsCommitment, newPerVOSpentVoiceCreditsSalt);
                    expect(circuitInputs.stateLeaves.length).toEqual(quadVoteTallyBatchSize);
                    return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)
                        // Check the result tally commitment
                    ];
                case 1:
                    witness = _a.sent();
                    expectedResultsCommitmentOutput = __1.getSignalByName(circuit, witness, 'main.newResultsCommitment').toString();
                    expectedResultsCommitment = maci_core_1.genTallyResultCommitment(tally, newResultsSalt, voteOptionTreeDepth);
                    expect(expectedResultsCommitmentOutput.toString()).toEqual(expectedResultsCommitment.toString());
                    expectedSpentVoiceCreditsCommitmentOutput = __1.getSignalByName(circuit, witness, 'main.newSpentVoiceCreditsCommitment').toString();
                    expectedSpentVoiceCreditsCommitment = maci_core_1.genSpentVoiceCreditsCommitment(voteWeight * voteWeight, newSpentVoiceCreditsSalt);
                    expect(expectedSpentVoiceCreditsCommitmentOutput.toString())
                        .toEqual(expectedSpentVoiceCreditsCommitment.toString());
                    perVOSpentVoiceCredits = maciState.computeBatchPerVOSpentVoiceCredits(startIndex, quadVoteTallyBatchSize);
                    expectedPerVOSpentVoiceCreditsCommitment = maci_core_1.genPerVOSpentVoiceCreditsCommitment(perVOSpentVoiceCredits, newPerVOSpentVoiceCreditsSalt, voteOptionTreeDepth);
                    expectedPerVOSpentVoiceCreditsCommitmentOutput = __1.getSignalByName(circuit, witness, 'main.newPerVOSpentVoiceCreditsCommitment').toString();
                    expect(expectedPerVOSpentVoiceCreditsCommitmentOutput.toString())
                        .toEqual(expectedPerVOSpentVoiceCreditsCommitment.toString());
                    totalVotes = __1.getSignalByName(circuit, witness, 'main.totalVotes').toString();
                    expect(totalVotes.toString()).toEqual(voteWeight.toString());
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=QuadVoteTally.test.js.map