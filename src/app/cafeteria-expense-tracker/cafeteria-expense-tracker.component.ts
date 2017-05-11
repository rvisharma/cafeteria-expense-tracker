import { Component, OnInit } from '@angular/core';
import { CafeteriaExpenseService, Order, DateFilter } from 'app/services/cafeteria-expense.service';


@Component({
  selector: 'app-cafeteria-expense-tracker',
  templateUrl: './cafeteria-expense-tracker.component.html',
  styleUrls: ['./cafeteria-expense-tracker.component.scss']
})
export class CafeteriaExpenseTrackerComponent implements OnInit {

  orders: Order[];
  totalSpent: number;

  dateFilter: DateFilter = {
    isActive: false,
    dateFilterType: undefined,
    singleDate: undefined,
    multiDates: undefined
  };


  dateOptions = [
    { key: 'today', value: 'Today' },
    { key: 'yesterday', value: 'Yesterday' },
    { key: 'current-month', value: 'Current Month' },
    { key: 'single-date', value: 'Single Date' },
    { key: 'multi-date', value: 'Multi Date' },
    { key: 'last-30-days', value: 'Last 30 Days' },
  ];

  constructor(private cExpenseService: CafeteriaExpenseService) { }

  getOrders = () => this.orders = this.cExpenseService.getExpenseData();
  calculateTotals = () => this.totalSpent = this.cExpenseService.getTotalSpent(this.orders);

  ngOnInit() {
    this.getOrders();
    this.calculateTotals();
  }

  applyFilter = () => {
    this.cExpenseService.activateFilter().setDateFilter(this.dateFilter);
    this.getOrders();
    this.calculateTotals();
  }

}
