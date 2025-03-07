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
exports.verifyProof = exports.genProofAndPublicSignals = exports.verifyQvtProof = exports.verifyBatchUstProof = exports.genQvtProofAndPublicSignals = exports.genBatchUstProofAndPublicSignals = exports.getSignalByNameViaSym = exports.getSignalByName = exports.executeCircuit = exports.compileAndLoadCircuit = void 0;
var fs = require("fs");
var assert = require("assert");
var lineByLine = require("n-readlines");
var path = require("path");
var circom = require('circom');
var shell = require("shelljs");
var maci_crypto_1 = require("maci-crypto");
var maci_config_1 = require("maci-config");
var zkutilPath = maci_config_1.config.zkutil_bin;
var snarkParamsPath = path.isAbsolute(maci_config_1.config.snarkParamsPath)
    ? maci_config_1.config.snarkParamsPath
    : path.resolve(__dirname, maci_config_1.config.snarkParamsPath);
/*
 * @param circuitPath The subpath to the circuit file (e.g.
 *     test/batchProcessMessage_test.circom)
 */
var compileAndLoadCircuit = function (circuitPath) { return __awaiter(void 0, void 0, void 0, function () {
    var circuit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, circom.tester(path.join(__dirname, "../circom/" + circuitPath))];
            case 1:
                circuit = _a.sent();
                return [4 /*yield*/, circuit.loadSymbols()];
            case 2:
                _a.sent();
                return [2 /*return*/, circuit];
        }
    });
}); };
exports.compileAndLoadCircuit = compileAndLoadCircuit;
var executeCircuit = function (circuit, inputs) { return __awaiter(void 0, void 0, void 0, function () {
    var witness;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, circuit.calculateWitness(inputs, true)];
            case 1:
                witness = _a.sent();
                return [4 /*yield*/, circuit.checkConstraints(witness)];
            case 2:
                _a.sent();
                return [4 /*yield*/, circuit.loadSymbols()];
            case 3:
                _a.sent();
                return [2 /*return*/, witness];
        }
    });
}); };
exports.executeCircuit = executeCircuit;
var getSignalByName = function (circuit, witness, signal) {
    return witness[circuit.symbols[signal].varIdx];
};
exports.getSignalByName = getSignalByName;
var getSignalByNameViaSym = function (circuitName, witness, signal) {
    var symPath = path.join(snarkParamsPath, circuitName + ".sym");
    var liner = new lineByLine(symPath);
    var line;
    var index;
    var found = false;
    while (true) {
        line = liner.next();
        if (!line) {
            break;
        }
        var s = line.toString().split(',');
        if (signal === s[3]) {
            index = s[1];
            found = true;
            break;
        }
    }
    assert(found);
    return witness[index];
};
exports.getSignalByNameViaSym = getSignalByNameViaSym;
var genBatchUstProofAndPublicSignals = function (inputs, configType) {
    var circuitPath;
    var circuitR1csPath;
    var circuitWitnessGenFilename;
    var wasmPath;
    var paramsPath;
    if (configType === 'test') {
        circuitPath = 'test/batchUpdateStateTree_test.circom';
        circuitR1csPath = 'batchUstCircuit.r1cs';
        circuitWitnessGenFilename = 'batchUst';
        wasmPath = 'batchUst.wasm';
        paramsPath = 'batchUst.params';
    }
    else if (configType === 'prod-small') {
        circuitPath = 'prod/batchUpdateStateTree_small.circom';
        circuitR1csPath = 'batchUstSmall.r1cs';
        circuitWitnessGenFilename = 'batchUstSmall';
        paramsPath = 'batchUstSmall.params';
        wasmPath = 'batchUstSmall.wasm';
    }
    else if (configType === 'prod-medium') {
        circuitPath = 'prod/batchUpdateStateTree_medium.circom';
        circuitR1csPath = 'batchUstMedium.r1cs';
        circuitWitnessGenFilename = 'batchUstMedium';
        paramsPath = 'batchUstMedium.params';
        wasmPath = 'batchUstMedium.wasm';
    }
    else if (configType === 'prod-large') {
        circuitPath = 'prod/batchUpdateStateTree_large.circom';
        circuitR1csPath = 'batchUstLarge.r1cs';
        circuitWitnessGenFilename = 'batchUstLarge';
        paramsPath = 'batchUstLarge.params';
        wasmPath = 'batchUstLarge.wasm';
    }
    else if (configType === 'prod-32') {
        circuitPath = 'prod/batchUpdateStateTree_32.circom';
        circuitR1csPath = 'batchUst32.r1cs';
        circuitWitnessGenFilename = 'batchUst32';
        paramsPath = 'batchUst32.params';
        wasmPath = 'batchUst32.wasm';
    }
    else {
        throw new Error('Only test, prod-small, prod-medium, prod-large, and prod-32 circuits are supported');
    }
    return genProofAndPublicSignals(inputs, circuitPath, circuitR1csPath, circuitWitnessGenFilename, wasmPath, paramsPath, false);
};
exports.genBatchUstProofAndPublicSignals = genBatchUstProofAndPublicSignals;
var genQvtProofAndPublicSignals = function (inputs, configType) {
    var circuitPath;
    var circuitR1csPath;
    var circuitWitnessGenFilename;
    var wasmPath;
    var paramsPath;
    if (configType === 'test') {
        circuitPath = 'test/quadVoteTally_test.circom';
        circuitR1csPath = 'qvtCircuit.r1cs';
        circuitWitnessGenFilename = 'qvt';
        wasmPath = 'qvt.wasm';
        paramsPath = 'qvt.params';
    }
    else if (configType === 'prod-small') {
        circuitPath = 'prod/quadVoteTally_small.circom';
        circuitR1csPath = 'qvtCircuitSmall.r1cs';
        circuitWitnessGenFilename = 'qvtSmall';
        wasmPath = 'qvtSmall.wasm';
        paramsPath = 'qvtSmall.params';
    }
    else if (configType === 'prod-medium') {
        circuitPath = 'prod/quadVoteTally_medium.circom';
        circuitR1csPath = 'qvtCircuitMedium.r1cs';
        circuitWitnessGenFilename = 'qvtMedium';
        wasmPath = 'qvtMedium.wasm';
        paramsPath = 'qvtMedium.params';
    }
    else if (configType === 'prod-large') {
        circuitPath = 'prod/quadVoteTally_large.circom';
        circuitR1csPath = 'qvtCircuitLarge.r1cs';
        circuitWitnessGenFilename = 'qvtLarge';
        wasmPath = 'qvtLarge.wasm';
        paramsPath = 'qvtLarge.params';
    }
    else if (configType === 'prod-32') {
        circuitPath = 'prod/quadVoteTally_32.circom';
        circuitR1csPath = 'qvtCircuit32.r1cs';
        circuitWitnessGenFilename = 'qvt32';
        wasmPath = 'qvt32.wasm';
        paramsPath = 'qvt32.params';
    }
    else {
        throw new Error('Only test, prod-small, prod-medium, prod-large, and prod-32 circuits are supported');
    }
    return genProofAndPublicSignals(inputs, circuitPath, circuitR1csPath, circuitWitnessGenFilename, wasmPath, paramsPath, false);
};
exports.genQvtProofAndPublicSignals = genQvtProofAndPublicSignals;
var genProofAndPublicSignals = function (inputs, circuitFilename, circuitR1csFilename, circuitWitnessGenFilename, wasmFilename, paramsFilename, compileCircuit) {
    if (compileCircuit === void 0) { compileCircuit = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var date, paramsPath, circuitR1csPath, witnessGenExe, circuitWasmPath, inputJsonPath, witnessPath, witnessJsonPath, proofPath, publicJsonPath, witnessCmd, proveCmd, witness, publicSignals, proof;
        return __generator(this, function (_a) {
            date = Date.now();
            paramsPath = path.join(snarkParamsPath, paramsFilename);
            circuitR1csPath = path.join(snarkParamsPath, circuitR1csFilename);
            witnessGenExe = path.join(snarkParamsPath, circuitWitnessGenFilename);
            circuitWasmPath = path.join(snarkParamsPath, wasmFilename);
            inputJsonPath = path.join(snarkParamsPath, date + '.input.json');
            witnessPath = path.join(snarkParamsPath, date + '.witness.wtns');
            witnessJsonPath = path.join(snarkParamsPath, date + '.witness.json');
            proofPath = path.join(snarkParamsPath, date + '.proof.json');
            publicJsonPath = path.join(snarkParamsPath, date + '.publicSignals.json');
            fs.writeFileSync(inputJsonPath, JSON.stringify(maci_crypto_1.stringifyBigInts(inputs)));
            witnessCmd = witnessGenExe + " " + inputJsonPath + " " + witnessJsonPath;
            shell.config.fatal = true;
            shell.exec(witnessCmd);
            proveCmd = zkutilPath + " prove -c " + circuitR1csPath + " -p " + paramsPath + " -w " + witnessJsonPath + " -r " + proofPath + " -o " + publicJsonPath;
            //const proveStart = Date.now()
            shell.exec(proveCmd);
            witness = maci_crypto_1.unstringifyBigInts(JSON.parse(fs.readFileSync(witnessJsonPath).toString()));
            publicSignals = maci_crypto_1.unstringifyBigInts(JSON.parse(fs.readFileSync(publicJsonPath).toString()));
            proof = JSON.parse(fs.readFileSync(proofPath).toString());
            shell.rm('-f', witnessPath);
            shell.rm('-f', witnessJsonPath);
            shell.rm('-f', proofPath);
            shell.rm('-f', publicJsonPath);
            shell.rm('-f', inputJsonPath);
            return [2 /*return*/, {
                    //circuit,
                    proof: proof,
                    publicSignals: publicSignals,
                    witness: witness
                }];
        });
    });
};
exports.genProofAndPublicSignals = genProofAndPublicSignals;
var verifyProof = function (paramsFilename, proofFilename, publicSignalsFilename) { return __awaiter(void 0, void 0, void 0, function () {
    var paramsPath, proofPath, publicSignalsPath, verifyCmd, output;
    return __generator(this, function (_a) {
        paramsPath = path.join(snarkParamsPath, paramsFilename);
        proofPath = path.join(snarkParamsPath, proofFilename);
        publicSignalsPath = path.join(snarkParamsPath, publicSignalsFilename);
        verifyCmd = zkutilPath + " verify -p " + paramsPath + " -r " + proofPath + " -i " + publicSignalsPath;
        output = shell.exec(verifyCmd).stdout.trim();
        shell.rm('-f', proofPath);
        shell.rm('-f', publicSignalsPath);
        return [2 /*return*/, output === 'Proof is correct'];
    });
}); };
exports.verifyProof = verifyProof;
var verifyBatchUstProof = function (proof, publicSignals, configType) {
    var date = Date.now().toString();
    var paramsFilename;
    var proofFilename;
    var publicSignalsFilename;
    if (configType === 'test') {
        paramsFilename = 'batchUst.params';
        proofFilename = date + ".batchUst.proof.json";
        publicSignalsFilename = date + ".batchUst.publicSignals.json";
    }
    else if (configType === 'prod-small') {
        paramsFilename = 'batchUstSmall.params';
        proofFilename = date + ".batchUstSmall.proof.json";
        publicSignalsFilename = date + ".batchUstSmall.publicSignals.json";
    }
    else if (configType === 'prod-medium') {
        paramsFilename = 'batchUstMedium.params';
        proofFilename = date + ".batchUstMedium.proof.json";
        publicSignalsFilename = date + ".batchUstMedium.publicSignals.json";
    }
    else if (configType === 'prod-large') {
        paramsFilename = 'batchUstLarge.params';
        proofFilename = date + ".batchUstLarge.proof.json";
        publicSignalsFilename = date + ".batchUstLarge.publicSignals.json";
    }
    else if (configType === 'prod-32') {
        paramsFilename = 'batchUst32.params';
        proofFilename = date + ".batchUst32.proof.json";
        publicSignalsFilename = date + ".batchUst32.publicSignals.json";
    }
    fs.writeFileSync(path.join(snarkParamsPath, proofFilename), JSON.stringify(maci_crypto_1.stringifyBigInts(proof)));
    fs.writeFileSync(path.join(snarkParamsPath, publicSignalsFilename), JSON.stringify(maci_crypto_1.stringifyBigInts(publicSignals)));
    return verifyProof(paramsFilename, proofFilename, publicSignalsFilename);
};
exports.verifyBatchUstProof = verifyBatchUstProof;
var verifyQvtProof = function (proof, publicSignals, configType) {
    var date = Date.now().toString();
    var paramsFilename;
    var proofFilename;
    var publicSignalsFilename;
    if (configType === 'test') {
        paramsFilename = 'qvt.params';
        proofFilename = date + ".qvt.proof.json";
        publicSignalsFilename = date + ".qvt.publicSignals.json";
    }
    else if (configType === 'prod-small') {
        paramsFilename = 'qvtSmall.params';
        proofFilename = date + ".qvtSmall.proof.json";
        publicSignalsFilename = date + ".qvtSmall.publicSignals.json";
    }
    else if (configType === 'prod-medium') {
        paramsFilename = 'qvtMedium.params';
        proofFilename = date + ".qvtMedium.proof.json";
        publicSignalsFilename = date + ".qvtMedium.publicSignals.json";
    }
    else if (configType === 'prod-large') {
        paramsFilename = 'qvtLarge.params';
        proofFilename = date + ".qvtLarge.proof.json";
        publicSignalsFilename = date + ".qvtLarge.publicSignals.json";
    }
    else if (configType === 'prod-32') {
        paramsFilename = 'qvt32.params';
        proofFilename = date + ".qvt32.proof.json";
        publicSignalsFilename = date + ".qvt32.publicSignals.json";
    }
    // TODO: refactor
    fs.writeFileSync(path.join(snarkParamsPath, proofFilename), JSON.stringify(maci_crypto_1.stringifyBigInts(proof)));
    fs.writeFileSync(path.join(snarkParamsPath, publicSignalsFilename), JSON.stringify(maci_crypto_1.stringifyBigInts(publicSignals)));
    return verifyProof(paramsFilename, proofFilename, publicSignalsFilename);
};
exports.verifyQvtProof = verifyQvtProof;
//# sourceMappingURL=index.js.map