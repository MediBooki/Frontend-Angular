import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ArticleComponent } from './article.component';
import { AppModule } from 'src/app/app.module';
describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleComponent ],
      imports:[SharedModule,AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
