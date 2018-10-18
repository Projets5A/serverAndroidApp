import * as express from "express";
import { StockData } from "../data/stockData";
import { User } from "../model/user";
import { IRoute } from "./iroutes";

export class UserRoutes implements IRoute {

    public readonly app: express.Application;
    public readonly stockData: StockData;

    constructor(app: express.Application, stockData: StockData) {
        this.app = app;
        this.stockData = stockData;
        this.launchRoutes();
    }

    public launchRoutes() {
        this.create();
        this.delete();
        this.changePassword();
        this.numberUsers();
        this.usersConnected();
        this.signIn();
        this.signOut();
        this.getUserInfos();
    }

    private create() {
        console.log("Path /createUser");
        let used: boolean = false;
        this.app.post("/createUser", (req: express.Request, res: express.Response) => {
            this.stockData.users.forEach( (user) => {
                if (req.query.password === user.getPassword() && req.query.email === user.email
                || req.query.pseudo === user.pseudo) {
                    used = true;
                }
            });
            if (used) {
                res.status(403).send("Error: User already in database or already used pseudo");
            } else {
                if (req.query.email && req.query.password && req.query.pseudo) {
                    const user = new User(req.query.email, req.query.password, req.query.pseudo);
                    this.stockData.users.push(user);
                    res.status(201).send("Account created !");
                } else {
                    res.status(400).send("Bad parameters");
                }
            }
        });
    }

    private delete() {
        console.log("Path /deleteUser");
        this.app.delete("/deleteUser", (req: express.Request, res: express.Response) => {
            for (let i = 0; i < this.stockData.users.length; i++) {
                if (req.query.password === this.stockData.users[i].getPassword()
                    && req.query.email === this.stockData.users[i].email) {
                    this.stockData.users.splice( i, 1 );
                    res.status(201).send("User deleted !");
                    break;
                }
                if (i === this.stockData.users.length - 1) {
                    res.status(404).send("Error: User does not exist");
                }
            }
        });
    }

    private signIn() {
        console.log("Path /signIn");
        this.app.get("/signIn", (req: express.Request, res: express.Response) => {
            console.log(req);
            let found: boolean = false;
            this.stockData.users.forEach( (user) => {
                if (req.query.password === user.getPassword() && req.query.email === user.email) {
                    found = true;
                    user.connected = true;
                    res.status(200).send({connexion: "authorized"});
                }
            });
            if(!found) {
                res.status(401).send({connexion: "unauthorized"});
            }
        });
    }

    private signOut() {
        console.log("Path /signOut");
        this.app.get("/signOut", (req: express.Request, res: express.Response) => {
            let found: boolean = false;
            this.stockData.users.forEach( (user) => {
                if (req.query.password === user.getPassword() && req.query.email === user.email) {
                    found = true;
                    user.connected = false;
                    res.status(200).send({deconnexion: "ok"});
                }
            });
            if (!found) {
                res.status(404).send({deconnection: "User not found"});
            }
        });
    }

    private changePassword() {
        console.log("Path /changePwd");
        this.app.post("/changePwd", (req: express.Request, res: express.Response) => {
            let found: boolean = false;
            this.stockData.users.forEach( (user) => {
                if (req.query.oldPassword === user.getPassword() && req.query.email === user.email) {
                    found = true;
                    user.changePassword(req.query.newPassword);
                    res.status(201).send("Password changed succefully");
                }
            });
            if (!found) {
                res.status(404).send("User not found");
            }
        });
    }

    private getUserInfos() {
        console.log("Path /getUserInfos");
        this.app.post("/getUserInfos", (req: express.Request, res: express.Response) => {
            let found: boolean = false;
            this.stockData.users.forEach((user) => {
                if (req.query.pseudo === user.pseudo) {
                    found = true;
                    res.status(200).send(user);
                }
            });
            if (!found) {
                res.status(404).send("User not found");
            }
        });
    }

    private numberUsers() {
        console.log("Path /getNbUsers");
        this.app.get("/getNbUsers", (req: express.Request, res: express.Response) => {
            res.status(200).send({numberUsers: this.stockData.users.length});
        });
    }

    private usersConnected() {
        console.log("Path /getUsers");
        this.app.get("/getUsers", (req: express.Request, res: express.Response) => {
            const usersConnected = [];
            this.stockData.users.forEach((user) => {
                if (user.connected) {
                    usersConnected.push(user);
                }
            });
            res.status(200).send({users: usersConnected});
        });
    }
}
