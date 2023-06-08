import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { SingleFaqComponent } from './single-faq.component';

describe('SingleFaqComponent', () => {
  let component: SingleFaqComponent;
  let fixture: ComponentFixture<SingleFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleFaqComponent ],
      imports:[SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
