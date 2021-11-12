import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.component.html',
  styleUrls: ['./received-message.component.css']
})
export class ReceivedMessageComponent implements OnInit {
  url = environment.apiUrl;
  @Input() username!:String;
  @Input() image!:String;
  @Input() body!:String;
  constructor() { }

  ngOnInit(): void {
  }

}
