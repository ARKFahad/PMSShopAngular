import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss']
})
export class CashPaymentComponent {
paymentAmount:any;
returnAmount:number=0;
  constructor(
    private toastr:ToastrService,
    public dialogRef: MatDialogRef<CashPaymentComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  doAction(){
    if(this.paymentAmount<this.data){
 this.toastr.warning("Please Change Received amount")
    }else{
  this.dialogRef.close({paymentAmount:this.data});
    }
    
  }

  closeDialog(){
    this.dialogRef.close();
  }
  onChangeReceivedAmount(){
    var num1 = this.paymentAmount.match(/^\d+$/);
    if(num1===null) this.paymentAmount=""
    this.returnAmount=this.paymentAmount-this.data
  }
}
