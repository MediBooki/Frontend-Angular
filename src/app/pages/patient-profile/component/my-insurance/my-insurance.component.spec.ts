import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInsuranceComponent } from './my-insurance.component';

describe('MyInsuranceComponent', () => {
  let component: MyInsuranceComponent;
  let fixture: ComponentFixture<MyInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
