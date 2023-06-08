import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { SpecializationsComponent } from './specializations.component';
import { AppModule } from 'src/app/app.module';
describe('SpecializationsComponent', () => {
  let component: SpecializationsComponent;
  let fixture: ComponentFixture<SpecializationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializationsComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
