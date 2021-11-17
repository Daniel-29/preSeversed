import { Component, Input, OnInit } from '@angular/core';
import { UserState } from '@app/shared/interfaces/data.interface';
import { Store, select, createSelector } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { pluck, take, tap } from 'rxjs/operators';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { Router } from '@angular/router';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  url= environment.apiUrl;
  @Input() IdUser!: string;
  @Input() IdtoFollow!: string;
  @Input() isOwner: Boolean = true;
  @Input() isFollow: Boolean = false;
  @Input() username!: string;
  @Input() display_name!: string;
  @Input() image!: string;
  @Input() description!: string;
  @Input() following!: string;
  @Input() followers!: string;
  textFollow = "Follow";
  idFollow!: string;
  private stateObserverAPI!: Subscription;



  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private router: Router,
  ) { }
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );
  ngOnInit(): void {
    if (this.IdUser != this.IdtoFollow) {
      try {
        const GET_FOLLOW = gql`
        query followByUsers($Following:String!,$Follower:String!){
          followByUsers(user_Owner:$Following,user_follwing:$Follower){
           id
          }
        }`;
        this.apollo.watchQuery<any>({
          query: GET_FOLLOW,
          variables: {
            Follower: this.IdUser,
            Following: this.IdtoFollow,
          },
          fetchPolicy: 'network-only'
        }).valueChanges.pipe(take(1), tap(({ data }) => {
          if (!(data.followByUsers == null)) {
            this.idFollow = data.followByUsers.id;
            this.isFollow = true;
            this.textFollow = "Following";
          }
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
      } catch (error) {
        console.log(error);
      }
    }
  }

  onFollow(): void {
    try {
      if (this.isFollow) {
        const DELETE_FOLLOW = gql`
        mutation deleteFollows($ID:String!,$Following:String!,$Follower:String!) {
          deleteFollows(id:$ID,user_Owner:$Following,user_follwing:$Follower)
          }
        `;
        this.apollo.mutate<any>({
          mutation: DELETE_FOLLOW,
          variables: {
            ID: this.idFollow,
            Follower: this.IdUser,
            Following: this.IdtoFollow,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.followers = (Number(this.followers) - 1).toString();
          this.idFollow = 'null';
          this.isFollow = false;
          this.textFollow = "Follow";
        }, (error) => {
          console.log('there was an error sending the query', error);
        }
        )).subscribe();
      } else {
        const ADD_FOLLOw = gql`
        mutation addFollows($Following:String!,$Follower:String!){
          addFollows(user_Owner:$Following,user_follwing:$Follower){
            id
          }
        }`;
        this.apollo.mutate<any>({
          mutation: ADD_FOLLOw,
          variables: {
            Follower: this.IdUser,
            Following: this.IdtoFollow,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.followers = (Number(this.followers) + 1).toString();
          this.textFollow = "Following";
          this.isFollow = true;
          this.idFollow = data.addFollows.id;
        }, (error) => {
          console.log('there was an error sending the query', error);
        }
        )).subscribe();
      }
    } catch (error) {
      console.log(error);
    }
  }
  onSendMessage(): void {
    try {
      this.getChatcode(this.IdtoFollow, this.IdUser);
    } catch (error) {
      console.log(error);
    }
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
            /* if(this.chatCode === 'vacio'){
              this.chatCode= 'chatByUser.chatcode';
            } */
            this.router.navigate(['/messages'])
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
          /*  if(this.chatCode === 'vacio'){
             this.chatCode= 'addChat.chatcode;'
           } */
           this.router.navigate(['/messages'])
          this.store.dispatch(apiHelperSlice.setChatcode(addChat.chatcode));
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
