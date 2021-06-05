import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConfirmationComponent } from './create-confirmation.component';

describe('CreateConfirmationComponent', () => {
  let component: CreateConfirmationComponent;
  let fixture: ComponentFixture<CreateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
