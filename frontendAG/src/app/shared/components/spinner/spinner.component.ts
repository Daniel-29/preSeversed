import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
          <div *ngIf="isLoading$|async" class="overlay">
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
`,
  styleUrls: ['./spinner.component.css'],
  //providers:[SpinnerService]
})
export class SpinnerComponent {
  isLoading$ = this.spinner.isLoading$;
  constructor(private spinner: SpinnerService) { }
}
