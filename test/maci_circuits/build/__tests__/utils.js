"use strict";
exports.__esModule = true;
exports.str2BigInt = void 0;
var str2BigInt = function (s) {
    return BigInt(parseInt(Buffer.from(s).toString('hex'), 16));
};
exports.str2BigInt = str2BigInt;
//# sourceMappingURL=utils.js.map