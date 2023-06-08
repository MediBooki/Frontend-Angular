import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { DoctorRegisterComponent } from './doctor-register.component';
import { AppModule } from 'src/app/app.module';
describe('DoctorRegisterComponent', () => {
  let component: DoctorRegisterComponent;
  let fixture: ComponentFixture<DoctorRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorRegisterComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
