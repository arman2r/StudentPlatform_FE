import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudentComponent } from './estudent.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('EstudentComponent', () => {
  let component: EstudentComponent;
  let fixture: ComponentFixture<EstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudentComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
