import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSubjectComponent } from './register-subject.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegisterSubjectComponent', () => {
  let component: RegisterSubjectComponent;
  let fixture: ComponentFixture<RegisterSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSubjectComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
