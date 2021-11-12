import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '@enviroment/environment';
import { MessagesOfChat } from '../interfaces/data.interface';
import { Observable, pipe, Subscription } from 'rxjs';
import { ChatsService } from './chats.service';
@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  socket!: any;
  chatSuscriptions!: Subscription;

  constructor(
    private chatsService: ChatsService,
  ) { }
  setupSocketConnection(chatcode: string) {
    this.socket = io(environment.apiUrl,{query:{
      chatcode:chatcode
    }});
    this.socket.on('onDownloadMessage',(data: any) => {
      this.chatsService.addMessageToChatData(data);
    })
  }

  sendMessage(body: MessagesOfChat,chatcode: string) {
     this.socket = io(environment.apiUrl,{query:{
      chatcode:chatcode
    }}); 
    this.socket.emit('onLoadNewMessage', body);
  }
  

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
