// this class simulate a data center

import { Message } from "../model/message";
import { PrivateChat } from "../model/privateChat";
import { User } from "../model/user";

export class StockData {
  public readonly users: User[];
  public chatGroup: Message[];
  public readonly privateChats: PrivateChat[];

  constructor() {
    this.users = [];
    this.chatGroup = [];
    this.privateChats = [];
  }
}
