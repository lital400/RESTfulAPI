"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userList = exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    constructor(inptId, inptFirst, inptLast, inptEmail, inptPassword) {
        this.userId = "";
        this.firstName = "";
        this.lastName = "";
        this.emailAddress = "";
        this.password = "";
        this.userId = inptId;
        this.firstName = inptFirst;
        this.lastName = inptLast;
        this.emailAddress = inptEmail;
        this.password = inptPassword;
    }
    get id() { return this.userId; }
    get first() { return this.firstName; }
    get last() { return this.lastName; }
    get email() { return this.emailAddress; }
    get pass() { return this.password; }
    set first(firstName) { this.firstName = firstName; }
    set last(lastName) { this.lastName = lastName; }
    set email(email) { this.emailAddress = email; }
    set pass(password) { this.password = password; }
    async ValidatePassword(password) {
        return await bcrypt_1.default.compare(password, this.password);
    }
    HashPassword(password) {
        bcrypt_1.default.hash(password, 10, (err, hash) => {
            this.password = hash;
        });
    }
}
exports.User = User;
var userList = [];
exports.userList = userList;
//# sourceMappingURL=user.js.map