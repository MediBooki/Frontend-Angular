import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../shared/shared.module';
import { RoadmapComponent } from './roadmap.component';
import { AppModule } from 'src/app/app.module';
describe('RoadmapComponent', () => {
  let component: RoadmapComponent;
  let fixture: ComponentFixture<RoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadmapComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
