import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRestoreComponent } from './create-restore.component';

describe('CreateRestoreComponent', () => {
  let component: CreateRestoreComponent;
  let fixture: ComponentFixture<CreateRestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRestoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
