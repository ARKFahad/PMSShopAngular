import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-discount-percentage',
  templateUrl: './discount-percentage.component.html',
  styleUrls: ['./discount-percentage.component.scss']
})
export class DiscountPercentageComponent {
 discount:any;

  constructor(
    public dialogRef: MatDialogRef<DiscountPercentageComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  doAction(){
    this.dialogRef.close({discount:this.discount});
  }
onChangeDiscount(){
//   var num1 = this.discount.match(/^\d+$/);
//     if(num1===null) this.discount=""
 }

  closeDialog(){
    this.dialogRef.close();
  }
}
