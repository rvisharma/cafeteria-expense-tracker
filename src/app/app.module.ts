import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { CustomMaterialModule } from "app/custom-material/custom-material.module";

import { AppComponent } from './app.component';
import { CafeteriaExpenseTrackerComponent } from './cafeteria-expense-tracker/cafeteria-expense-tracker.component';
import { CafeteriaExpenseService } from 'app/services/cafeteria-expense.service';

@NgModule({
  declarations: [
    AppComponent,
    CafeteriaExpenseTrackerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CustomMaterialModule
  ],
  providers: [
    CafeteriaExpenseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
