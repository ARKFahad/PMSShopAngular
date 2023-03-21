import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LogoutDialogComponent } from '../../core/shared/components/logout-dialog/logout-dialog.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

    LogoutDialogComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    TranslateModule,
  ],
})
export class AdminModule {}
