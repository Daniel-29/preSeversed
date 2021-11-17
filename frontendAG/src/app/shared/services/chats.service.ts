import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { take, pluck, withLatestFrom, tap } from 'rxjs/operators';
import { UserChatInterface, MessagesOfChat } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private UsersChatSubject = new BehaviorSubject<UserChatInterface[]>([]);
  UsersChat$ = this.UsersChatSubject.asObservable();

  private MessagesChatSubject = new BehaviorSubject<MessagesOfChat[]>([]);
  MessagesChat$ = this.MessagesChatSubject.asObservable();


  constructor(
    private apollo: Apollo,
  ) { }

  getUserChatData(IdUser: string, page: string): void {
    try {
      const USERS_CHAT = gql`
      query userListChat($USER: String!,$PAGE:String!){ 
        userListChat(user_Owner:$USER,page:$PAGE){
          chatcode
          id
          user_Chat{
            id
            username
            display_name
            image
          }
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: USERS_CHAT,
        variables: {
          USER: IdUser,
          PAGE: page
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'userListChat'),
        withLatestFrom(this.UsersChat$),
        tap(([apiResponse, userListChat]) => {
          this.UsersChatSubject.next([...userListChat, ...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
  clearMessagesByChatData() {
    this.MessagesChatSubject.next([]);
  }
  addMessageToChatData(NewMessage:MessagesOfChat) {
    this.MessagesChat$.pipe(
      take(1),
      tap((MessagesChat) => {
        this.MessagesChatSubject.next([NewMessage,...MessagesChat]);
      })
    ).subscribe();
  }
  getMessagesChatData(chatcode: string, page: string): void {
    try {
      const MESSAGES_CHAT = gql`
      query user_follwing($CHATCODE: String!,$PAGE:String!){ 
        messagesByChat(chatcode:$CHATCODE,page:$PAGE){
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
      this.apollo.watchQuery<any>({
        query: MESSAGES_CHAT,
        variables: {
          CHATCODE: chatcode,
          PAGE: page
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'messagesByChat'),
        withLatestFrom(this.MessagesChat$),
        tap(([apiResponse, messagesByChat]) => {
          this.MessagesChatSubject.next([...messagesByChat, ...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
