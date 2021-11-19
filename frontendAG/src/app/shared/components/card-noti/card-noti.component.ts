import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-card-noti',
  templateUrl: './card-noti.component.html',
  styleUrls: ['./card-noti.component.css']
})
export class CardNotiComponent implements OnInit {
  url = environment.apiUrl;
  @Input() id!: String;
  @Input() username!: String;
  @Input() display_name!: String;
  @Input() image!: String;
  @Input() unicode!: String;
  body: String = "test";
  constructor() { }

  ngOnInit(): void {
    switch (this.unicode) {
      case '1':
        this.body = this.username + " follow you"
        break;
      case '2':
        this.body = this.username + " stopped following you"
        break;
      case '3':
        this.body = this.username + " liked your post"
        break;
      case '4':
        this.body = this.username + " removed his like from your post"
        break;
      case '5':
        this.body = this.username + " commented on your post"
        break;
      case '6':
        this.body = this.username + " sent you a message "
        break;
      case '7':
        this.body = this.username + " commented on your post"
        break;
    }
  }

}
