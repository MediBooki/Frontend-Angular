import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { PatientProfileComponent } from './patient-profile.component';
import { AppModule } from 'src/app/app.module';
describe('PatientProfileComponent', () => {
  let component: PatientProfileComponent;
  let fixture: ComponentFixture<PatientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientProfileComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
