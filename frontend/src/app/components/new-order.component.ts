import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  newOrderForm : FormGroup

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {

    this.newOrderForm = this.fb.group({
      employee_id: this.fb.control('', [Validators.required]),
      customer_id: this.fb.control('', [Validators.required]),
      shipper_id  : this.fb.control('', [Validators.required]),
      ship_zip_postal_code: this.fb.control('', [Validators.required]),
      tax_status_id: this.fb.control('', [Validators.required]),
      status_id: this.fb.control('', [Validators.required]),
      ship_name: this.fb.control('', [Validators.required]),
    })
  }

  async placeOrder(){
    const orderData = new HttpParams()
    .set('employee_id', this.newOrderForm.get('employee_id').value)
    .set('customer_id', this.newOrderForm.get('customer_id').value)
    .set('shipper_id', this.newOrderForm.get('shipper_id').value)
    .set('ship_zip_postal_code', this.newOrderForm.get('ship_zip_postal_code').value)
    .set('tax_status_id', this.newOrderForm.get('tax_status_id').value)
    .set('status_id', this.newOrderForm.get('status_id').value)
    .set('ship_name', this.newOrderForm.get('ship_name').value)

    const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
//    .set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // const result = await this.http.post('/order', orderData.toString(), {headers: httpHeaders}).toPromise()  
      this.http.post('/order', orderData.toString(), {headers: httpHeaders}).toPromise().then(
        function(router: Router) {
          // success callback
          window.alert('Order Added!')
        },
        function(response) {
          // failure callback,handle error here
          // response.data.message will be "This is an error!"
          console.log(response)
          window.alert(response.error.message)
        }
      )
      this.router.navigate(['/orders'])

    
  }

}
