import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedItemsComponent } from './fixed-items.component';

describe('FixedItemsComponent', () => {
  let component: FixedItemsComponent;
  let fixture: ComponentFixture<FixedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedItemsComponent ]
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
