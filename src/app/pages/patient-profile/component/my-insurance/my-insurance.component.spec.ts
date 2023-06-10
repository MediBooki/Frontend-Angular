import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { AppModule } from 'src/app/app.module';
import { MyInsuranceComponent } from './my-insurance.component';

describe('MyInsuranceComponent', () => {
  let component: MyInsuranceComponent;
  let fixture: ComponentFixture<MyInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInsuranceComponent ],
      imports:[AppModule,SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
