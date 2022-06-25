import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerPayment } from '../../models/customerPayment';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit{
  customerBalance:number
paymentAmount:number;
paymentMethodId:string;
paymentMethods:any[]
  constructor(
    public dialogRef: MatDialogRef<PaymentComponent>,
    private http:HttpClient,
    private authService:AuthService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }
  ngOnInit(): void {
    this.getPaymentMethods();
   this.getCustomerBalance()
  }

  getCustomerBalance(){
      this.http.get<any>(environment.apiUrl + 'account/balance/' + this.data?.accountId+'/1/'+this.authService.getBranchId).subscribe(res=>{
        this.customerBalance=res?.balance
      })
  }
  doAction(){
    if(this.paymentMethodId && this.paymentAmount>0){
    var payment=new CustomerPayment();
    payment.branchId=this.authService.getBranchId;
    payment.customerId=this.data.id;
    payment.paymentAmount=this.paymentAmount;
    payment.paymentMethodId=this.paymentMethodId;
    payment.remark='Payment Received From Pos';
    this.dialogRef.close(payment);
    }else{
      alert('Payment Method can not be blank and amount must be greater than 0 !!')
    }
    
  }
getPaymentMethods(){
     this.http.post<any>(environment.apiUrl+'PaymentMethod/search', {page:-1})
      .subscribe(res => {
        this.paymentMethods = res.data.item1;
        
      });
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
