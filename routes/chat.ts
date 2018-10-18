import * as express from "express";
import { StockData } from "../data/StockData";
import { Message } from "../model/message";
import { PrivateChat } from "../model/privateChat";
import { IRoute } from "./iroutes";

export class ChatRoutes implements IRoute {

    public readonly app: express.Application;
    public readonly stockData: StockData;

    constructor(app: express.Application, stockData: StockData) {
      this.app = app;
      this.stockData = stockData;
      this.launchRoutes();
    }

    public launchRoutes() {
      this.sendPrivateMessage();
      this.getPrivateMessages();
      this.getGroupeMessages();
      this.sendGroupMessage();
    }

    private sendGroupMessage() {
      console.log("Path /sendGroupMessage");
      this.app.post("/sendGroupMessage", (req: express.Request, res: express.Response) => {
        if (req.query.author && req.query.message) {
          let found: boolean = false;
          this.stockData.users.forEach((user) => {
            if (user.pseudo === req.query.author) {
              found = true;
            }
          });
          if (found) {
            const message = new Message(req.query.author, req.query.message);
            this.stockData.chatGroup.push(message);
            res.status(201).send("Group message well received !");
          } else {
            res.status(404).send("User not found");
          }
        } else {
          res.status(400).send("Bad parameters");
        }
      });
    }

    private sendPrivateMessage() {
      console.log("Path /sendPrivateMessage");
      this.app.post("/sendPrivateMessage", (req: express.Request, res: express.Response) => {
        if (req.query.user1 && req.query.user2 && req.query.message) {
          let user1found: boolean = false;
          let user2found: boolean = false;
          this.stockData.users.forEach((user) => {
            if (user.pseudo === req.query.user1) {
              user1found = true;
            }
            if (user.pseudo === req.query.user2) {
              user2found = true;
            }
          });
          if (user1found && user2found) {
            let chat: PrivateChat;
            this.stockData.privateChats.forEach((privatechat) => {
              if (privatechat.user1 === req.query.user1 && privatechat.user2 === req.query.user2
                || privatechat.user1 === req.query.user2 && privatechat.user2 === req.query.user1) {
                  chat = privatechat;
                }
            });
            if (!chat) {
              chat = new PrivateChat(req.query.user1, req.query.user2);
              this.stockData.privateChats.push(chat);
            }
            const message = new Message(req.query.user1, req.query.message);
            chat.messages.push(message);
            res.status(201).send("Private message well received !");
          } else {
            res.status(401).send("At least one of the users was not found");
          }
        } else {
          res.status(400).send("Bad parameters");
        }
      });
    }

    private getGroupeMessages() {
      console.log("Path /getGroupeMessages");
      this.app.get("/getGroupeMessages", (req: express.Request, res: express.Response) => {
        res.status(200).send(this.stockData.chatGroup);
      });
    }

    private getPrivateMessages() {
      console.log("Path /getPrivateMessages");
      this.app.get("/getPrivateMessages", (req: express.Request, res: express.Response) => {
        let found: boolean = false;
        this.stockData.privateChats.forEach((privatechat) => {
          if (privatechat.user1 === req.query.user1 && privatechat.user2 === req.query.user2
            || privatechat.user1 === req.query.user2 && privatechat.user2 === req.query.user1) {
              found = true;
              console.log(privatechat);
              res.status(200).send(privatechat.messages);
            }
        });
        if (!found) {
          res.status(404).send("Private conversation not found");
        }
      });
    }
}
