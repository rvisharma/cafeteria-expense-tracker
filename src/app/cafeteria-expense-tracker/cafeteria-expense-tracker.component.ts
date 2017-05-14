import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CafeteriaExpenseService, Order, DateFilter } from './../services/cafeteria-expense.service';
import * as _ from 'lodash';
import { Dictionary } from "lodash";


@Component({
  selector: 'app-cafeteria-expense-tracker',
  templateUrl: './cafeteria-expense-tracker.component.html',
  styleUrls: ['./cafeteria-expense-tracker.component.scss']
})
export class CafeteriaExpenseTrackerComponent implements OnInit {
  groupedOrders: Array<{ dateTotal: number; orders: Order[]}>;

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
    { key: 'previous-month', value: 'Previous Month' },
    { key: 'single-date', value: 'Single Date' },
    { key: 'multi-date', value: 'Multi Date' },
    { key: 'last-30-days', value: 'Last 30 Days' },
  ];

  constructor(private cExpenseService: CafeteriaExpenseService) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    const { totalSpent, groupedOrders } = this.cExpenseService.getOrderGroups();
    this.totalSpent = totalSpent;
    this.groupedOrders = groupedOrders;
  }

  applyFilter = () => {
    this.cExpenseService.setDateFilter(this.dateFilter);
    this.fetchOrders();
  }
}
