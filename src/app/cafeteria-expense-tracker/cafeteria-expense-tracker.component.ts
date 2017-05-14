import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CafeteriaExpenseService, Order, DateFilter } from './../services/cafeteria-expense.service';
import { MdSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { Dictionary } from "lodash";


@Component({
  selector: 'app-cafeteria-expense-tracker',
  templateUrl: './cafeteria-expense-tracker.component.html',
  styleUrls: ['./cafeteria-expense-tracker.component.scss']
})
export class CafeteriaExpenseTrackerComponent implements OnInit {
  groupedOrders: Array<{ dateTotal: number; orders: Order[] }>;
  totalSpent: number;
  summary: string;
  dateOptions;
  dateFilter: DateFilter = {
    isActive: false,
    dateFilterType: undefined,
    singleDate: undefined,
    multiDates: undefined
  };


  constructor(private cExpenseService: CafeteriaExpenseService, private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.applyFilter();
    this.fetchOrders();
    this.summary = this.getSummary();
    this.dateOptions = this.cExpenseService.getDateOptions();
  }

  fetchOrders = () => {
    const { totalSpent, groupedOrders } = this.cExpenseService.getOrderGroups();
    this.totalSpent = totalSpent;
    this.groupedOrders = groupedOrders;
  }

  validateDateFilter = () => {
    // Messages
    const { isActive, singleDate, dateFilterType } = this.dateFilter;
    if (isActive && dateFilterType === 'single-date' && !singleDate) {
      this.snackBar.open('You need to select a date', '', { duration: 3000, extraClasses: ['snack-bar-error'] });
      return false;
    }
  }

  applyFilter = () => {
    if (!this.validateDateFilter) {
      return;
    }
    this.validateDateFilter();
    this.cExpenseService.setDateFilter(this.dateFilter);
    this.fetchOrders();
    this.summary = this.getSummary();
  }

  getSummary = () => {
    let message = `You have spent ₹${this.totalSpent}`;
    switch (this.dateFilter.isActive && this.dateFilter.dateFilterType) {
      case 'today':
        message += ' today';
        break;
      case 'yesterday':
        message += ' yesterday';
        break;
      case 'current-month':
        message += ' in this month';
        break;
      case 'previous-month':
        message += ' in previous month';
        break;
      case 'single-date':
        if (this.dateFilter.singleDate) {
          const date = this.dateFilter.singleDate.toDateString();
          message += ` on ${date}`;
        }
        break;
      case 'last-30-days':
        message += ' in last thirty days'
        break;
      default:
        message += ' till now';
    }
    return message + '.';
  }

  getMaxVendorName = () => {
    const orders = _.flatten(this.groupedOrders.map(each => each.orders));
    return this.cExpenseService.getMaxVendorName(orders);
  }
}
