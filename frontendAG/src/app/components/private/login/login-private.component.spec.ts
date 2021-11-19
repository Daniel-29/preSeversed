import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPrivateComponent } from './login-private.component';

describe('LoginPrivateComponent', () => {
  let component: LoginPrivateComponent;
  let fixture: ComponentFixture<LoginPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPrivateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
