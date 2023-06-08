import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { MedicineComponent } from './medicine.component';
import { AppModule } from 'src/app/app.module';
describe('MedicineComponent', () => {
  let component: MedicineComponent;
  let fixture: ComponentFixture<MedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
