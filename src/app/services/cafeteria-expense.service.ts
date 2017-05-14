import { Injectable } from '@angular/core';
import { sample } from './sample-orders';
import * as _ from 'lodash';

export interface DateFilter {
  isActive: boolean;
  dateFilterType: 'single-date' | 'multi-date' | 'current-month' | 'previous-month' | 'last-30-days' | 'today' | 'yesterday';
  singleDate: Date;
  multiDates: Date[];
}

export interface VendorFilter {
  isActive: false;
  selectedVendor: string;
}

export interface TrackerConfig {
  filter: {
    dateFilter: DateFilter,
    vendorFilter: VendorFilter
  };
}

export interface Order {
  date: Date;
  amount: number;
  vendor: string;
}


const parseDate = (d: string) => {
  const [fullDate, time] = d.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  const [date, month, year] = fullDate.split('-').map(Number);
  return new Date(2000 + year, month - 1, date, hours, minutes);
};

const sampleData: Order[] = sample.map(each => ({
  date: parseDate(each.date),
  amount: parseInt(each.amount, 10),
  vendor: each.vendor
}));

@Injectable()
export class CafeteriaExpenseService {
  rawData: Order[];
  trackerConfig: TrackerConfig = {
    filter: {
      dateFilter: {
        isActive: false,
        dateFilterType: undefined,
        singleDate: undefined,
        multiDates: undefined
      },
      vendorFilter: {
        isActive: false,
        selectedVendor: undefined
      }
    }
  };

  constructor() {
    this.rawData = sampleData;
  }

  resetData = () => {
    this.rawData = sampleData;
  }



  applyDateFilter = (orders: Order[], dateFilter: DateFilter) => {
    if (dateFilter.isActive) {
      const today = new Date();
      const compareWithSingleDate = (d1: Date, d2: Date) => {
        const isSameDate = d1.getDate() === d2.getDate()
          && d1.getMonth() === d2.getMonth()
          && d1.getFullYear() === d2.getFullYear();
        return isSameDate;
      };
      switch (dateFilter.dateFilterType) {
        case 'today':
          orders = orders.filter(({ date }) => compareWithSingleDate(date, today));
          break;
        case 'yesterday':
          const yesterday: Date = new Date(today.setHours(-24));
          orders = orders.filter(({ date }) => compareWithSingleDate(date, yesterday));
          break;
        case 'single-date':
          const singleDate = dateFilter.singleDate;
          orders = orders.filter(({ date }) => compareWithSingleDate(date, singleDate));
          break;
        case 'current-month':
          const currentMonth = today.getMonth();
          orders = orders.filter(({ date }) => date.getMonth() === currentMonth);
          break;
        case 'previous-month':
          const previousMonth = today.getMonth() - 1;
          orders = orders.filter(({ date }) => date.getMonth() === previousMonth);
          break;
        case 'last-30-days':
          const dt = new Date();
          dt.setMonth(dt.getMonth() - 1); // going back a month from today
          orders = orders.filter(({ date }) => date >= dt);
          break;
        default:
          return orders;
      }
    }
    console.log(orders.length);
    return orders;
  }

  applyVendorFilter = (orders: Order[], vendorFilter: VendorFilter) => {
    return vendorFilter.isActive ? orders : orders;
  }

  getExpenseData = () => {
    const filter = this.trackerConfig.filter;
    let orders: Order[] = this.rawData.slice();
    orders = filter.dateFilter.isActive ? this.applyDateFilter(orders, filter.dateFilter) : orders;
    orders = filter.vendorFilter.isActive ? this.applyVendorFilter(orders, filter.vendorFilter) : orders;
    return orders;
  }

  getOrderGroups = () => {
    const orders = this.getExpenseData();
    const totalSpent = orders.map(each => each.amount).reduce((sum, x) => sum + x, 0);
    const orderMap = orders.reduce((orderMap, order) => {
      const orderDate: string = order.date.toDateString();
      if (orderMap.has(orderDate)) {
        const dateEntry = orderMap.get(orderDate)
        dateEntry.dateTotal += order.amount;
        dateEntry.orders.push(order);
      } else {
        orderMap.set(orderDate, { dateTotal: order.amount, orders: [order] });
      }
      return orderMap;
    }, new Map<string, { dateTotal: number; orders: Order[] }>());

    return {
      totalSpent: totalSpent,
      groupedOrders: Array.from(orderMap.values())
    };
  }

  setDateFilter = (dateFilter: DateFilter) => this.trackerConfig.filter.dateFilter = dateFilter;

}
