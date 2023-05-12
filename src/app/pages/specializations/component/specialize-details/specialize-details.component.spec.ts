import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializeDetailsComponent } from './specialize-details.component';

describe('SpecializeDetailsComponent', () => {
  let component: SpecializeDetailsComponent;
  let fixture: ComponentFixture<SpecializeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
