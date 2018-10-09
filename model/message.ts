export class Message {
  public readonly author: string;
  public readonly content: string;

  constructor(author: string, content: string) {
    this.author = author;
    this.content = content;
  }
}
