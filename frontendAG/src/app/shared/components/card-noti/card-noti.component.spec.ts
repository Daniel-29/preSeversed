import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNotiComponent } from './card-noti.component';

describe('CardNotiComponent', () => {
  let component: CardNotiComponent;
  let fixture: ComponentFixture<CardNotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardNotiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
