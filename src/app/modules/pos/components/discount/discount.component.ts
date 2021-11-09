import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent  {

 discount:number=0;

  constructor(
    public dialogRef: MatDialogRef<DiscountComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  doAction(){
    this.dialogRef.close({discount:this.discount});
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
