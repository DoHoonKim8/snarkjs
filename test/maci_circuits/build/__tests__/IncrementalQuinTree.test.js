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
var LEVELS = 3;
var ZERO_VALUE = 0;
describe('Quin Merkle Tree circuits', function () {
    describe('QuinTreeInsertionProof', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/quinTreeInclusionProof_test.circom')];
                    case 1:
                        circuit = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Valid QuinTreeInsertionProof inputs should work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, i, randomVal, index, path, isValid, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        for (i = 0; i < 30; i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                        }
                        index = 7;
                        path = tree.genMerklePath(index);
                        isValid = maci_crypto_1.IncrementalQuinTree.verifyMerklePath(path, tree.hashFunc);
                        expect(isValid).toBeTruthy();
                        circuitInputs = {
                            path_elements: path.pathElements,
                            path_index: path.indices,
                            leaf: tree.leaves[index]
                        };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).toEqual(tree.root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
        it('An modified Merkle proof should produce a different root', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, i, randomVal, index, path, isValid, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        for (i = 0; i < 30; i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                        }
                        index = 7;
                        path = tree.genMerklePath(index);
                        isValid = maci_crypto_1.IncrementalQuinTree.verifyMerklePath(path, tree.hashFunc);
                        expect(isValid).toBeTruthy();
                        path.pathElements[0][0] = maci_crypto_1.genRandomSalt();
                        circuitInputs = {
                            path_elements: path.pathElements,
                            path_index: path.indices,
                            leaf: tree.leaves[index]
                        };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot.toString()).not.toEqual(tree.root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('QuinCheckRoot', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/quinTreeCheckRoot_test.circom')];
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
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        leaves = [];
                        for (i = 0; i < Math.pow(5, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                            leaves.push(randomVal);
                        }
                        root = tree.root;
                        circuitInputs = { leaves: leaves };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).toEqual(root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Different leaves should generate a different root', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, leaves, i, randomVal, root, circuitInputs, witness, circuitRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        leaves = [];
                        for (i = 0; i < Math.pow(5, LEVELS); i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                            leaves.push(randomVal);
                        }
                        leaves[0] = BigInt(0);
                        root = tree.root;
                        circuitInputs = { leaves: leaves };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        witness = _a.sent();
                        circuitRoot = __1.getSignalByName(circuit, witness, 'main.root').toString();
                        expect(circuitRoot).not.toEqual(root.toString());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('QuinLeafExists', function () {
        var circuit;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.compileAndLoadCircuit('test/quinTreeLeafExists_test.circom')];
                    case 1:
                        circuit = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Valid QuinLeafExists inputs should work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, index, i, randomVal, path, isValid, circuitInputs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        index = 7;
                        for (i = 0; i < 30; i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                        }
                        path = tree.genMerklePath(index);
                        isValid = maci_crypto_1.IncrementalQuinTree.verifyMerklePath(path, tree.hashFunc);
                        expect(isValid).toBeTruthy();
                        circuitInputs = {
                            path_elements: path.pathElements,
                            path_index: path.indices,
                            leaf: tree.leaves[index],
                            root: tree.root
                        };
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Invalid QuinLeafExists inputs should not work', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tree, index, i, randomVal, path, isValid, circuitInputs, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expect.assertions(2);
                        tree = new maci_crypto_1.IncrementalQuinTree(LEVELS, ZERO_VALUE);
                        index = 7;
                        for (i = 0; i < 30; i++) {
                            randomVal = maci_crypto_1.genRandomSalt();
                            tree.insert(randomVal);
                        }
                        path = tree.genMerklePath(index);
                        isValid = maci_crypto_1.IncrementalQuinTree.verifyMerklePath(path, tree.hashFunc);
                        expect(isValid).toBeTruthy();
                        path.pathElements[0][0] = BigInt(path.pathElements[0][0]) + BigInt(1);
                        circuitInputs = {
                            path_elements: path.pathElements,
                            path_index: path.indices,
                            leaf: tree.leaves[index],
                            root: tree.root
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, __1.executeCircuit(circuit, circuitInputs)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        expect(true).toBeTruthy();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=IncrementalQuinTree.test.js.map