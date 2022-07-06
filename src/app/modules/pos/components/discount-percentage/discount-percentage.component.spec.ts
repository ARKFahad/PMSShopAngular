import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountPercentageComponent } from './discount-percentage.component';

describe('DiscountPercentageComponent', () => {
  let component: DiscountPercentageComponent;
  let fixture: ComponentFixture<DiscountPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountPercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
