import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import { Notifications, DataResponse } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private profileNotisSubject = new BehaviorSubject<Notifications[]>([]);
  NotisByUser$ = this.profileNotisSubject.asObservable();
  
  constructor(private apollo: Apollo) { }
  getNotisByUserData(IdUser: string, page: string): void {
    try {
      const NOTI_BY_USER = gql`
      query notificationsByUser($ID:String!,$PAGE:String!){ 
        notificationsByUser(user_Owner:$ID,page:$PAGE){
          id
          unicodeNoti
          user_Writer{
            id
            username
            display_name
            image
          }
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: NOTI_BY_USER,
        variables: {
          ID: IdUser,
          PAGE: page
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'notificationsByUser'),
        withLatestFrom(this.NotisByUser$),
        tap(([apiResponse, notificationsByUser]) => {
          this.profileNotisSubject.next([...notificationsByUser, ...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
