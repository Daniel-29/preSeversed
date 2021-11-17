import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatsService } from '@app/shared/services/chats.service';
import { Store, createSelector } from '@ngrx/store';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@enviroment/environment';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  url = environment.apiUrl;
  @Input() idUserProfile!: string;
  @Output() userSelectedID = new EventEmitter<string>();
  userFollow$ = this.chatsService.UsersChat$;
  page!:string;
  private stateObserver!: Subscription;

  constructor(
    private chatsService: ChatsService,
    private readonly store: Store<{}>,
  ) { }

  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );

  onSelectedChat(id: any): void {
    this.userSelectedID.emit(id);
  }

  ngOnInit(): void {
    this.stateObserver = this.apiHelperSlice$.pipe(tap(data=>{
      this.page= data.ContactsPage;
      if(!data.ContactsisLoading){
        this.store.dispatch(apiHelperSlice.setContactsisLoading(true));
        this.chatsService.getUserChatData(this.idUserProfile, this.page)
      }
    })).subscribe();
  }

  onMoreData() {
    this.page = (Number(this.page)+1).toString();
    //this.postService.getTagsPost('',this.page);
    this.store.dispatch(apiHelperSlice.setContactsPage(this.page));
    this.chatsService.getUserChatData(this.idUserProfile, this.page)
  }
  
  ngOnDestroy() {
    this.stateObserver.unsubscribe();
  }

}
