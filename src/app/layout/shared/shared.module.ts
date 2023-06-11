import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SpinnerComponent } from '../request-spinner/spinner/spinner.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { FixedItemsComponent } from '../fixed-items/fixed-items.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastrModule } from 'ngx-toastr';
import { MedicineComponent } from 'src/app/pages/pharmacy/component/medicine/medicine.component';
import { OwlModule } from 'ngx-owl-carousel';
import { RatingComponent } from '../rating/rating.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RoadmapComponent } from '../roadmap/roadmap.component'; 
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ActivatedRoute } from '@angular/router';
import 'select2';




@NgModule({
    declarations: [
        SpinnerComponent,
        NavbarComponent,
        FooterComponent,
        LoadingScreenComponent,
        FixedItemsComponent,
        CarouselComponent,
        MedicineComponent,
        RatingComponent,
        RoadmapComponent
    ],
    exports: [
        TranslateModule,
        SpinnerComponent,
        NavbarComponent,
        FooterComponent,
        LoadingScreenComponent,
        FixedItemsComponent,
        CarouselComponent,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelect2Module,
        NgxPaginationModule,
        // CarouselModule,
        MedicineComponent,
        RouterModule,
        OwlModule,
        RatingComponent,
        NgbRatingModule,
        RoadmapComponent,
        NgxSkeletonLoaderModule,
        
    ],
    imports: [
        // PharmacyModule,
        CommonModule,
        HttpClientModule,
        TranslateModule.forChild({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            isolate: false
        }),
        ToastrModule.forRoot({
            timeOut: 4000,
            extendedTimeOut: 2500,
            progressBar: true,
        }),
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgSelect2Module,
        NgxPaginationModule,
        // CarouselModule,
        OwlModule,
        NgbRatingModule,
        NgxSkeletonLoaderModule.forRoot({ animation: 'progress'})


        // MedicineModule
    ],
    providers:[
        // ActivatedRoute
    ]
})
export class SharedModule { }

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
