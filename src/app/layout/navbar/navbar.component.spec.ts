import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar.component';
import { AppModule } from 'src/app/app.module';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports:[AppModule,SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
