import bcrypt from 'bcrypt';

class User {
    userId: string = "";
    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    password: string = "";

    constructor(inptId: string, inptFirst: string, inptLast: string, inptEmail: string, inptPassword: string){
        this.userId = inptId;
        this.firstName = inptFirst;
        this.lastName = inptLast;
        this.emailAddress = inptEmail;
        this.password = inptPassword;
    }

    get id(): string { return this.userId; }
    get first(): string { return this.firstName; }
    get last(): string { return this.lastName; }
    get email(): string { return this.emailAddress; }
    get pass(): string { return this.password; }

    set first(firstName: string) { this.firstName = firstName; }
    set last(lastName: string) { this.lastName = lastName; }
    set email(email: string) { this.emailAddress = email; }
    set pass(password: string) { this.password = password; }

    async ValidatePassword(password : string) {  
        return await bcrypt.compare(password, this.password);
    } 

    HashPassword(password : string){
        bcrypt.hash(password, 10, (err, hash) => {
            this.password = hash;
        });
    }
}

var userList: User[] = [];

export {User, userList};
