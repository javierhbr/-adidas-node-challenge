"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.InvalidParameterException = void 0;
var common_1 = require("@nestjs/common");
var InvalidParameterException = /** @class */ (function (_super) {
    __extends(InvalidParameterException, _super);
    function InvalidParameterException(details) {
        var _this = this;
        var response = {
            code: 'invalid-parameter',
            message: 'Bad Request',
            details: details
        };
        _this = _super.call(this, response, common_1.HttpStatus.BAD_REQUEST) || this;
        return _this;
    }
    return InvalidParameterException;
}(common_1.HttpException));
exports.InvalidParameterException = InvalidParameterException;
