import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { SpecializeComponent } from './specialize.component';

describe('SpecializeComponent', () => {
  let component: SpecializeComponent;
  let fixture: ComponentFixture<SpecializeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializeComponent ],
      imports:[SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
