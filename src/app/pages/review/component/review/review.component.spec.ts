import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ReviewComponent } from './review.component';
import { AppModule } from 'src/app/app.module';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
