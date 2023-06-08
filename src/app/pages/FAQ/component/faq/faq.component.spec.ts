import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { FAQComponent } from './faq.component';
import { AppModule } from 'src/app/app.module';

describe('FAQComponent', () => {
  let component: FAQComponent;
  let fixture: ComponentFixture<FAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQComponent ],
      imports: [SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
