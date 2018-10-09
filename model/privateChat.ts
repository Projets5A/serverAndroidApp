import { Message } from "./message";

export class PrivateChat {
  public readonly user1: string;
  public readonly user2: string;
  public readonly messages: Message[];

  constructor(user1: string, user2: string) {
    this.user1 = user1;
    this.user2 = user2;
    this.messages = [];
  }
}
