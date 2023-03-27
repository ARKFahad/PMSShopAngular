import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { MaterialModule } from 'src/app/core/material/material.module';
import { PosComponent } from './pos.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CustomerSelectionComponent } from './components/customer-selection/customer-selection.component';

import { SharedModule } from 'src/app/core/shared/shared.module';
import { CartComponent } from './components/cart/cart.component';
import { PosToolbarComponent } from './components/pos-toolbar/pos-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CatalogSkeletonComponent } from './components/catalog-skeleton/catalog-skeleton.component';
import { CartSkeletonComponent } from './components/cart-skeleton/cart-skeleton.component';
import { CustomerSkeletonComponent } from './components/customer-skeleton/customer-skeleton.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DiscountComponent } from './components/discount/discount.component';
import { CustomerRegisterComponent } from './components/customer-register/customer-register.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CashPaymentComponent } from './components/cash-payment/cash-payment.component';
import { CreditSaleCheckoutComponent } from './components/credit-sale-checkout/credit-sale-checkout.component';
import { DiscountPercentageComponent } from './components/discount-percentage/discount-percentage.component';

@NgModule({
  declarations: [
    PosComponent,
    CustomerComponent,
    CatalogComponent,
    CustomerSelectionComponent,
    CartComponent,
    PosToolbarComponent,
    CatalogSkeletonComponent,
    CartSkeletonComponent,
    CustomerSkeletonComponent,
    CheckoutComponent,
    DiscountComponent,
    CustomerRegisterComponent,
    PaymentComponent,
    CashPaymentComponent,
    CreditSaleCheckoutComponent,
    DiscountPercentageComponent,
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    MaterialModule,
    SharedModule,
    TranslateModule,
    NgxSkeletonLoaderModule,
  ],
})
export class PosModule {}
