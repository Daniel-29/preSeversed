import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '@app/shared/services/post.service';
import { environment } from '@enviroment/environment';
import { createSelector, Store } from '@ngrx/store';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-right',
  templateUrl: './side-bar-right.component.html',
  styleUrls: ['./side-bar-right.component.css']
})
export class SideBarRightComponent implements OnInit, OnDestroy {

  tags$ = this.postService.tagsPost$;
  page!: string;
  formSearch = new FormGroup({
    search: new FormControl('', [
      Validators.maxLength(25),
      Validators.pattern(environment.TextValidation)
    ]),
  });

  private stateObserver!: Subscription;

  constructor(
    private postService: PostService,
    private toastr: ToastrService,
    private readonly store: Store<{}>,
  ) { }
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );

  ngOnInit(): void {
    this.stateObserver = this.apiHelperSlice$.pipe(tap(data => {
      this.page = data.TrendsPage;
      if (!data.TrendsisLoading) {
        this.store.dispatch(apiHelperSlice.setTrendsisLoading(true));
        this.postService.getTagsPost('', this.page);
      }
    })).subscribe();
  }
  onMoreData() {
    this.page = (Number(this.page) + 1).toString();
    //this.postService.getTagsPost('',this.page);
    this.store.dispatch(apiHelperSlice.setTrendsPage(this.page));
    this.postService.getTagsPost('', this.page);
  }
  onSearchData() {
    try {
      if (this.formSearch.invalid) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        this.postService.clearPostFeedData();
        this.postService.getPostFeedData(this.formSearch.controls.search.value, this.page, true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  ngOnDestroy() {
    this.stateObserver.unsubscribe();
  }
}
