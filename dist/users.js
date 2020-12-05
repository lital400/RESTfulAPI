"use strict";
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
}
//# sourceMappingURL=users.js.map