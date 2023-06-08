import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { OrderDetailsComponent } from './order-details.component';
import { AppModule } from 'src/app/app.module';
describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailsComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.orderDetails = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
