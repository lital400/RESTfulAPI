"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(inptId, inptFirst, inptLast, inptEmail, inptPassword) {
        this._userId = inptId;
        this._firstName = inptFirst;
        this._lastName = inptLast;
        this._email = inptEmail;
        this._password = inptPassword;
    }
    get id() { return this._userId; }
    get firstName() { return this._firstName; }
    get lastName() { return this._lastName; }
    get email() { return this._email; }
    get password() { return this._password; }
    set firstName(firstName) { this._firstName = firstName; }
    set lastName(lastName) { this._lastName = lastName; }
    set email(email) { this._email = email; }
    set password(password) { this._password = password; }
}
exports.User = User;
//# sourceMappingURL=user.js.map