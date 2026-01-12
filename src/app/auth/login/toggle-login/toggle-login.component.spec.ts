import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleLoginComponent } from './toggle-login.component';

describe('ToggleLoginComponent', () => {
  let component: ToggleLoginComponent;
  let fixture: ComponentFixture<ToggleLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
