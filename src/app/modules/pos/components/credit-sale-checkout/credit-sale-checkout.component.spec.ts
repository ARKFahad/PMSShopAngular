import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSaleCheckoutComponent } from './credit-sale-checkout.component';

describe('CreditSaleCheckoutComponent', () => {
  let component: CreditSaleCheckoutComponent;
  let fixture: ComponentFixture<CreditSaleCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSaleCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditSaleCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
