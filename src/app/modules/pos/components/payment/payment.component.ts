import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
paymentAmount:any;

  constructor(
    public dialogRef: MatDialogRef<PaymentComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  doAction(){
    this.dialogRef.close({paymentAmount:this.paymentAmount});
  }
onChangeAmount(){
   var num1 = this.paymentAmount.match(/^\d+$/);
    if(num1===null) this.paymentAmount=""
}
  closeDialog(){
    this.dialogRef.close();
  }
}
