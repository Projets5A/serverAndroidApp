export class User {
    public connected: boolean;
    public pseudo: string;
    public readonly email: string;
    private password: string;

    constructor(email: string, password: string, pseudo: string) {
        this.email = email;
        this.password = password;
        this.pseudo = pseudo;
        this.connected = true;
    }

    public changePassword(newPassword: string) {
        this.password = newPassword;
    }

    public getPassword(): string {
        return this.password;
    }
}
