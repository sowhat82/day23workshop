import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  result = []
  
  constructor(private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    this.result = await this.http.get<any>('/order-details').toPromise() 

    console.info(this.result)
  }

  async deleteRecord(order_id: number){

    const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')

    await this.http.post('/delete', "id="+order_id.toString(), {headers: httpHeaders}).toPromise()
    this.result = await this.http.get<any>('/order-details').toPromise() 

  }

}
