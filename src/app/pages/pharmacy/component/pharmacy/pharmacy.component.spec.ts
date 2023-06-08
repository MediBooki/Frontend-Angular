import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { PharmacyComponent } from './pharmacy.component';
import { AppModule } from 'src/app/app.module';
describe('PharmacyComponent', () => {
  let component: PharmacyComponent;
  let fixture: ComponentFixture<PharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
