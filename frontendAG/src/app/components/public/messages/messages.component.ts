import { Component, OnDestroy, OnInit } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as profileUserSlice from '@shared/slice/user.slice';
import { pluck, take, tap } from 'rxjs/operators';
import { ChatsService } from '@app/shared/services/chats.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { WebSocketService } from '@app/shared/services/web-socket.service';
import { environment } from '@enviroment/environment';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  idUser!: string;
  idUserChat: string = '';
  username!: string;
  display_name!: string;
  image!: string;
  chatCode: string = 'vacio';
  page!: string;
  private stateObserverAPI!: Subscription;

  messages$ = this.chatsService.MessagesChat$;
  private stateObserver!: Subscription;
  forMessage = new FormGroup({
    "body": new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(80),
      Validators.pattern(environment.TextValidation)
    ]),
  });
  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private chatsService: ChatsService,
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
  ) { }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );
  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.stateObserver = this.UserSlice$.pipe(tap(data => {
      this.idUser = data.id;
      this.username = data.username;
      this.display_name = data.display_name;
      this.image = data.image
    })).subscribe();
    this.stateObserverAPI = this.apiHelperSlice$.pipe(tap(data => {
      this.page = data.MessagesPage;
      if (data.Chatcode != '' && this.chatCode === 'vacio' && !data.MessagesisLoading) {
        this.chatCode = data.Chatcode;
        this.webSocketService.disconnect();
        this.webSocketService.setupSocketConnection(data.Chatcode);
        this.chatsService.clearMessagesByChatData();
        this.chatsService.getMessagesChatData(data.Chatcode, '0')
        this.store.dispatch(apiHelperSlice.setMessagesPage('0'));
      }
    })).subscribe();
  }
  onMoreData() {
    this.page = (Number(this.page) + 1).toString();
    this.store.dispatch(apiHelperSlice.setMessagesPage(this.page));
    this.chatsService.getMessagesChatData(this.chatCode, this.page)
  }
  ngOnDestroy() {
    this.webSocketService.disconnect();
    this.stateObserverAPI.unsubscribe();
    this.stateObserver.unsubscribe();
  }
  onLoadMessages(chatcode: string) {
    this.chatCode='vacio';
    this.store.dispatch(apiHelperSlice.setChatcode(chatcode));
  }

  getChatcode(user_Owner: string, user_Chat: string): void {
    try {
      const CHAT_CODE = gql`
      query user_follwing($Owner: String!,$Chat:String!){ 
        chatByUser(user_Owner:$Owner,user_Chat:$Chat){
          id
          chatcode
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: CHAT_CODE,
        variables: {
          Owner: user_Owner,
          Chat: user_Chat
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'chatByUser'),
        tap((chatByUser) => {
          if (chatByUser === null) {
            this.createChat(user_Owner, user_Chat, user_Chat + user_Owner);
            this.createChat(user_Chat, user_Owner, user_Chat + user_Owner);
          } else {
            if (this.chatCode === 'vacio') {
              this.chatCode = 'chatByUser.chatcode';
            }
            this.store.dispatch(apiHelperSlice.setChatcode(chatByUser.chatcode));
          }
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  createChat(user_Owner: string, user_Chat: string, chatCode: string): void {
    try {
      const CREATE_CHAT = gql`
      mutation addChat($Owner: String!,$Chat:String!,$CHATCode:String!){ 
          addChat(user_Owner:$Owner,user_Chat:$Chat,chatcode:$CHATCode){
          id
          chatcode
        }
      }
    `;
      this.apollo.mutate<any>({
        mutation: CREATE_CHAT,
        variables: {
          Owner: user_Owner,
          Chat: user_Chat,
          CHATCode: chatCode,
        },
        fetchPolicy: 'network-only'
      }).pipe(
        take(1),
        pluck('data', 'addChat'),
        tap((addChat) => {
          if (this.chatCode === 'vacio') {
            this.chatCode = 'addChat.chatcode;'
          }
          this.store.dispatch(apiHelperSlice.setChatcode(addChat.chatcode));
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  addMesssageToChat(): void {
    //this.webSocketService.sendMessage(this.forMessage.controls.body.value)
    try {
       if (!this.forMessage.valid) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        }
        );
      } else if (this.chatCode === '') {
        this.toastr.warning('No chat selected', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        }
        );
      } else {
        const ADD_MESSAGE = gql`
        mutation addMessage($BODY: String!,$USER:String!,$CHAT:String!) {
          addMessage(message:$BODY,user_Owner:$USER,chatcode:$CHAT) {
          id
          message
          user_Owner{
            id
            username
            display_name
            image
          }
        }
      }
      `;
        this.apollo.mutate<any>({
          mutation: ADD_MESSAGE,
          variables: {
            BODY: this.forMessage.controls.body.value,
            USER: this.idUser,
            CHAT: this.chatCode,
          },
          fetchPolicy: 'network-only'
        }).pipe(take(1), tap(({ data }) => {
          this.forMessage.reset();
          this.forMessage.controls.body.setValue('');
          //this.chatsService.addMessageToChatData(data.addMessage);
          this.webSocketService.sendMessage(data.addMessage,this.chatCode)
        }, (error) => {
          //this.toastr.error('somethings is wrong :C', 'error!');
          console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
