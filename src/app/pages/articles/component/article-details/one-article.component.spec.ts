import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { OneArticleComponent } from './one-article.component';
import { AppModule } from 'src/app/app.module';
describe('OneArticleComponent', () => {
  let component: OneArticleComponent;
  let fixture: ComponentFixture<OneArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneArticleComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
