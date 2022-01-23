import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.scss']
})
export class CustomerRegisterComponent implements OnInit {

  customerForm: FormGroup;
  formTitle: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CustomerRegisterComponent>, private toastr: ToastrService, private fb: FormBuilder,private http:HttpClient) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.customerForm = this.fb.group({
      name: [this.data && this.data.name, Validators.required],
      contact: [this.data && this.data.contact, Validators.required],
      address:[this.data && this.data.address]
    })
    
  }

  onSubmit() {
    if (this.customerForm.valid) {
        this.http.post<any>(environment.apiUrl+'customer',this.customerForm.value).subscribe(response => {
          this.toastr.success(response?.message);
          this.dialogRef.close(response?.data);
        })
      }
    }
  }


