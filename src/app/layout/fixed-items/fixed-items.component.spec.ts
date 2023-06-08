import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../shared/shared.module';
import { FixedItemsComponent } from './fixed-items.component';

describe('FixedItemsComponent', () => {
  let component: FixedItemsComponent;
  let fixture: ComponentFixture<FixedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedItemsComponent ],
      imports:[SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
