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
var __1 = require("../");
var maci_crypto_1 = require("maci-crypto");
var LEVELS = 4;
var ZERO_VALUE = 0;
describe('Merkle Tree circuits', function () {
    describe('LeafExists', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/merkleTreeLeafExists_test.circom')];
                    case 1:
                        circuit = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Valid LeafExists inputs should work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, leaves, i, randomVal, root, i, proof, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        leaves = [];
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(maci_crypto_1.hashOne(randomVal));
                            leaves.push(maci_crypto_1.hashOne(randomVal));
                        }
                        root = tree.root;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < Math.pow(2, LEVELS))) return [3 /*break*/, 4];
                        proof = tree.genMerklePath(i);
                        circuitInputs = {
                            leaf: leaves[i],
                            path_elements: proof.pathElements,
                            path_index: proof.indices,
                            root: root
                        };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 2:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).toEqual(root.toString());
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('Invalid LeafExists inputs should not work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, leaves, i, randomVal, root, i, proof, circuitInputs, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expect.assertions(Math.pow(2, LEVELS));
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        leaves = [];
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                            leaves.push(maci_crypto_1.hashOne(randomVal));
                        }
                        root = tree.root;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < Math.pow(2, LEVELS))) return [3 /*break*/, 6];
                        proof = tree.genMerklePath(i);
                        circuitInputs = {
                            leaf: leaves[i],
                            // The following are swapped to delibrately create an error
                            path_elements: proof.pathElements,
                            path_index: proof.indices,
                            root: root
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        expect(true).toBeTruthy();
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('CheckRoot', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/merkleTreeCheckRoot_test.circom')];
                    case 1:
                        circuit = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Valid CheckRoot inputs should work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, leaves, i, randomVal, root, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        leaves = [];
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(maci_crypto_1.hashOne(randomVal));
                            leaves.push(maci_crypto_1.hashOne(randomVal));
                        }
                        root = tree.root;
                        circuitInputs = { leaves: leaves };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot.toString()).toEqual(root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Different leaves should generate a different root', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, leaves, i, randomVal, leaf, root, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        leaves = [];
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            leaf = maci_crypto_1.hashOne(randomVal);
                            tree.insert(leaf);
                            // Give the circuit a different leaf
                            leaves.push(BigInt(randomVal) + BigInt(1));
                        }
                        root = tree.root;
                        circuitInputs = { leaves: leaves };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot.toString())
                            .not.toEqual(root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('MerkleTreeInclusionProof', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/merkleTreeInclusionProof_test.circom')];
                    case 1:
                        circuit = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Valid update proofs should work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, i, randomVal, leaf, i, randomVal, leaf, proof, root, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        // Populate the tree
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            leaf = maci_crypto_1.hashOne(randomVal);
                            tree.insert(leaf);
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < Math.pow(2, LEVELS))) return [3 /*break*/, 4];
                        randomVal = maci_crypto_1.genRandomSalt();
                        leaf = maci_crypto_1.hashOne(randomVal);
                        tree.update(i, leaf);
                        proof = tree.genMerklePath(i);
                        root = tree.root;
                        circuitInputs = maci_crypto_1.stringifyBigInts({
                            leaf: leaf,
                            path_elements: proof.pathElements,
                            path_index: proof.indices
                        });
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 2:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).toEqual(root.toString());
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('Invalid update proofs should not work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, i, randomVal, leaf, i, randomVal, leaf, proof, isValid, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
                        // Populate the tree
                        for (i = 0; i < Math.pow(2, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            leaf = maci_crypto_1.hashOne(randomVal);
                            tree.insert(leaf);
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < Math.pow(2, LEVELS))) return [3 /*break*/, 4];
                        randomVal = maci_crypto_1.genRandomSalt();
                        leaf = maci_crypto_1.hashOne(randomVal);
                        tree.update(i, leaf);
                        proof = tree.genMerklePath(i);
                        // Delibrately create an invalid proof
                        proof.pathElements[0][0] = BigInt(1);
                        isValid = maci_crypto_1.IncrementalQuinTree.verifyMerklePath(proof, tree.hashFunc);
                        expect(isValid).toBeFalsy();
                        circuitInputs = {
                            leaf: leaf.toString(),
                            path_elements: proof.pathElements,
                            path_index: proof.indices
                        };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 2:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).not.toEqual(tree.root.toString());
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=IncrementalMerkleTree.test.js.map