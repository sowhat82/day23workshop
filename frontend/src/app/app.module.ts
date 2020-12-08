import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrdersComponent } from './components/orders.component';
import { NewOrderComponent } from './components/new-order.component';

const appRoutes: Routes = [
  { path: '', component: OrdersComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'new-order', component: NewOrderComponent },
  ];

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    NewOrderComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, ReactiveFormsModule, HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
