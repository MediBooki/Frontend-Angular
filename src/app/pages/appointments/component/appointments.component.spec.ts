import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentsComponent } from './appointments.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { AppModule } from 'src/app/app.module';
import * as $ from 'jquery';
import 'select2';
// Optionally import any additional dependencies required by Select2
// import 'select2/dist/css/select2.css';


describe('AppointmentsComponent', () => {
  let component: AppointmentsComponent;
  let fixture: ComponentFixture<AppointmentsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentsComponent],
      imports: [HttpClientTestingModule, SharedModule,AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
