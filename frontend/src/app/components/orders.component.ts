import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { database } from '../database.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  result = []

  constructor(private http: HttpClient, private db: database) { }

  async ngOnInit(): Promise<void> {

    this.result = await this.http.get<any>('/orders').toPromise() 

    console.info(this.result)
  }

  async deleteRecord(id: number){
    console.info(id)

    const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')

    await this.http.post('/delete', "id="+id.toString(), {headers: httpHeaders}).toPromise()
    this.result = await this.http.get<any>('/orders').toPromise() 

  }

}
