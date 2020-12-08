import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  result = []

  constructor(private http: HttpClient) { }

  async ngOnInit(): Promise<void> {

    this.result = await this.http.get<any>('/orders').toPromise() 

    console.info(this.result)
  }

}
