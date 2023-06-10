import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicineDetailsComponent } from './medicine-details.component';
import { DataService } from 'src/app/core/services/data.service';
import { BehaviorSubject, of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { PharmacyService } from '../../service/pharmacy.service';
import { ActivatedRoute } from '@angular/router';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MedicineDetailsComponent', () => {
  let component: MedicineDetailsComponent;
  let fixture: ComponentFixture<MedicineDetailsComponent>;
  let dataService: DataService;
  let pharmacyService: PharmacyService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const dataServiceMock = {
      _lang: of('en') // Mock the _lang observable with a BehaviorSubject
    };
    const pharmacyServiceMock = {
      getSpecificMedicine: jasmine.createSpy('getSpecificMedicine').and.returnValue(
        of({
          data: {
            id: 1,
            name: 'Medicine 1',
            description: 'Description',
            price: 10,
            manufactured_by: 'Manufacturer',
            photo: 'photo-url',
            category: { id: 1, name: 'Category' }
          }
        } as any)
      ),
      getFilteredMedicines: jasmine.createSpy('getFilteredMedicines').and.returnValue(
        of({ data: [] })
      )
    };
    const activatedRouteMock = {
      params: of({ id: 1 })
    };

    await TestBed.configureTestingModule({
      declarations: [MedicineDetailsComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: PharmacyService, useValue: pharmacyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      imports: [SharedModule, AppModule, HttpClientTestingModule] // Add HttpClientTestingModule
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineDetailsComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
    pharmacyService = TestBed.inject(PharmacyService);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set language and direction properties based on the dataService _lang', () => {
    spyOn(component, 'getLang').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getLang).toHaveBeenCalled();
    expect(component.lang).toBe('en');
    expect(component.rtlDir).toBe(false);
    expect(component.direction).toBe('ltr');
  });

  it('should retrieve medicine details and set component properties', fakeAsync(() => {
    spyOn(dataService._lang, 'subscribe').and.callThrough();

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(dataService._lang.subscribe).toHaveBeenCalled();
    expect(component.lang).toBe('en');
    expect(component.rtlDir).toBe(false);
    expect(component.direction).toBe('ltr');
    expect(pharmacyService.getSpecificMedicine).toHaveBeenCalledWith(1, 'en');
    expect(component.medicineDetails).toEqual({
      id: 1,
      name: 'Medicine 1',
      description: 'Description',
      price: 10,
      manufactured_by: 'Manufacturer',
      photo: 'photo-url',
      category: { id: 1, name: 'Category' }
    } as Medicine);
  }));

  it('should filter medicines by category', () => {
    // Arrange
    const filteredMedicines = [
      { id: 2, name: 'Medicine 2', category: { id: 1, name: 'Category' } },
      { id: 3, name: 'Medicine 3', category: { id: 1, name: 'Category' } }
    ];
    // spyOn(pharmacyService, 'getFilteredMedicines').and.returnValue(of({ data: filteredMedicines }));

    // Act
    component.filterMedicinesCategory();

    // Assert
    expect(component.medicineFilterForm.value['categories']).toEqual([component.medicineDetails?.category?.id]);
    // expect(component.categoryMedicines).toEqual(filteredMedicines);
    expect(component.categoriesLoaded).toBeTrue();
  });
});
