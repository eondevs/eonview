import { Injectable } from '@angular/core';

export class Message {
  content: string;
  style: string;

  constructor(content, style?) {
    this.content = content;
    this.style = style || 'info';
  }
}

@Injectable()
export class NotificationsService {

  constructor() { }

  private messages = [];
  private messageQueue = [];

  getMessages() {
    return this.messages;
  }

  sendMessage(content, style?) {
    if (this.messages.length > 4) this.messageQueue.push(new Message(content, style));
    else {
      this.messages.push(new Message(content, style));
      this.destroyMessage();
    }
  }

  destroyMessage(key?) {
    let that = this;
    setTimeout(() => {
      that.messages.splice(0, 1);
      if (that.messageQueue.length > 0) {
        that.messages.push(that.messageQueue[0]);
        that.messageQueue.splice(0, 1);
        this.destroyMessage();
      }
    }, 5500);
  }
}
