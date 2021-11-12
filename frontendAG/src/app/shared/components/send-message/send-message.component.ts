import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@enviroment/environment';
@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  url = environment.apiUrl;
  @Input() username!:String;
  @Input() image!:String;
  @Input() body!:String;
  constructor() { }

  ngOnInit(): void {
  }

}
