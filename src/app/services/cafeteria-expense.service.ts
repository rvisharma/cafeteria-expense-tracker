import { Injectable } from '@angular/core';

import * as _ from 'lodash';

export interface DateFilter {
  isActive: boolean;
  dateFilterType: 'single-date' | 'multi-date' | 'current-month' | 'last-30-days' | 'today' | 'yesterday';
  singleDate: Date;
  multiDates: Date[];
}

export interface VendorFilter {
  isActive: false;
  selectedVendor: string;
}

export interface TrackerConfig {
  filter: {
    isActive: boolean;
    dateFilter: DateFilter,
    vendorFilter: VendorFilter
  };
}

export interface Order {
  date: Date;
  amount: number;
  vendor: string;
}

// tslint:disable-next-line:max-line-length
const sampleDataString = '[{"date":"May 10 2017 8:01:21 PM","orderTotal":"₹23.00","vendor":"Swami"},{"date":"May 10 2017 3:56:14 PM","orderTotal":"₹14.00","vendor":"Joshi"},{"date":"May 10 2017 3:53:23 PM","orderTotal":"₹28.00","vendor":"Fruits"},{"date":"May 10 2017 12:49:39 PM","orderTotal":"₹15.00","vendor":"Kailash Bhel"},{"date":"May 10 2017 12:34:33 PM","orderTotal":"₹25.00","vendor":"Kailash Bhel"},{"date":"May 10 2017 10:45:26 AM","orderTotal":"₹23.00","vendor":"Joshi"},{"date":"May 9 2017 5:49:06 PM","orderTotal":"₹12.00","vendor":"Swami"},{"date":"May 9 2017 5:43:14 PM","orderTotal":"₹14.00","vendor":"Swami"},{"date":"May 9 2017 5:42:17 PM","orderTotal":"₹28.00","vendor":"Swami"},{"date":"May 9 2017 12:30:25 PM","orderTotal":"₹15.00","vendor":"Fruits"},{"date":"May 9 2017 11:07:57 AM","orderTotal":"₹28.00","vendor":"Fruits"},{"date":"May 8 2017 4:30:19 PM","orderTotal":"₹14.00","vendor":"Fruits"},{"date":"May 8 2017 4:26:21 PM","orderTotal":"₹28.00","vendor":"Swami"},{"date":"May 8 2017 12:46:02 PM","orderTotal":"₹15.00","vendor":"Swami"},{"date":"May 5 2017 4:29:19 PM","orderTotal":"₹28.00","vendor":"Kailash Bhel"},{"date":"May 5 2017 4:27:26 PM","orderTotal":"₹14.00","vendor":"Kailash Bhel"},{"date":"May 5 2017 12:39:38 PM","orderTotal":"₹20.00","vendor":"Kailash Bhel"},{"date":"May 5 2017 12:21:01 PM","orderTotal":"₹10.00","vendor":"Kailash Bhel"},{"date":"May 5 2017 11:11:09 AM","orderTotal":"₹33.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 5:36:38 PM","orderTotal":"₹23.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 5:35:39 PM","orderTotal":"₹28.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 5:33:51 PM","orderTotal":"₹14.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 12:32:53 PM","orderTotal":"₹15.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 10:51:15 AM","orderTotal":"₹14.00","vendor":"Kailash Bhel"},{"date":"May 4 2017 10:45:44 AM","orderTotal":"₹28.00","vendor":"Dosa Centre"},{"date":"May 3 2017 11:21:37 AM","orderTotal":"₹28.00","vendor":"Dosa Centre"},{"date":"May 3 2017 11:20:45 AM","orderTotal":"₹14.00","vendor":"Dosa Centre"},{"date":"Apr 28 2017 5:10:01 PM","orderTotal":"₹33.00","vendor":"Dosa Centre"},{"date":"Apr 28 2017 4:57:39 PM","orderTotal":"₹14.00","vendor":"Dosa Centre"},{"date":"Apr 28 2017 12:55:46 PM","orderTotal":"₹15.00","vendor":"Dosa Centre"},{"date":"Apr 28 2017 12:39:14 PM","orderTotal":"₹59.00","vendor":"Complete"},{"date":"Apr 27 2017 3:39:22 PM","orderTotal":"₹116.00","vendor":"Complete"},{"date":"Apr 26 2017 4:12:56 PM","orderTotal":"₹15.00","vendor":"Complete"},{"date":"Apr 26 2017 3:54:23 PM","orderTotal":"₹23.00","vendor":"Complete"},{"date":"Apr 26 2017 12:27:10 PM","orderTotal":"₹15.00","vendor":"Complete"},{"date":"Apr 25 2017 7:21:11 PM","orderTotal":"₹35.00","vendor":"Complete"},{"date":"Apr 25 2017 4:01:14 PM","orderTotal":"₹27.00","vendor":"Complete"},{"date":"Apr 25 2017 3:43:00 PM","orderTotal":"₹35.00","vendor":"Complete"},{"date":"Apr 25 2017 12:21:15 PM","orderTotal":"₹15.00","vendor":"Fruits"},{"date":"Apr 24 2017 6:41:35 PM","orderTotal":"₹14.00","vendor":"Fruits"},{"date":"Apr 24 2017 6:26:34 PM","orderTotal":"₹30.00","vendor":"Fruits"},{"date":"Apr 12 2017 12:36:13 PM","orderTotal":"₹59.00","vendor":"Fruits"},{"date":"Apr 11 2017 11:21:03 AM","orderTotal":"₹28.00","vendor":"Fruits"}]';

const sampleData: Order[] = (JSON.parse(sampleDataString) as any[]).map(each => ({
  date: new Date(each.date),
  amount: parseInt(each.orderTotal.slice(1), 10),
  vendor: each.vendor
}));

@Injectable()
export class CafeteriaExpenseService {
  sampleData: Order[];
  trackerConfig: TrackerConfig = {
    filter: {
      isActive: false,
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
    this.sampleData = sampleData;
  }

  resetData = () => {
    this.sampleData = sampleData;
    this.trackerConfig.filter.isActive = false;
  }



  applyDateFilter = (orders: Order[], dateFilter: DateFilter) => {
    if (dateFilter.isActive) {
      const compareWithSingleDate = (d1: Date, d2: Date) => {
        const isSameDate = d1.getDate() === d2.getDate()
          && d1.getMonth() === d2.getMonth()
          && d1.getFullYear() === d2.getFullYear();
        return isSameDate;
      };
      switch (dateFilter.dateFilterType) {
        case 'today':
          const today: Date = new Date();
          orders = orders.filter(({ date }) => compareWithSingleDate(date, today));
          break;
        case 'yesterday':
          const yesterday: Date = new Date(new Date().setHours(-24));
          orders = orders.filter(({ date }) => compareWithSingleDate(date, yesterday));
          break;
        case 'single-date':
          const singleDate = dateFilter.singleDate;
          orders = orders.filter(({ date }) => compareWithSingleDate(date, singleDate));
          break;
        case 'current-month':
          const currentMonth = new Date().getMonth();
          orders = orders.filter(({ date }) => date.getMonth() === currentMonth);
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
    let orders: Order[] = this.sampleData.slice();
    if (filter.isActive) {
      orders = filter.dateFilter.isActive ? this.applyDateFilter(orders, filter.dateFilter) : orders;
      orders = filter.vendorFilter.isActive ? this.applyVendorFilter(orders, filter.vendorFilter) : orders;
    }
    return orders;
  }

  getVendors = () => {
    return _.uniq(this.sampleData.map(each => each.vendor));
  }

  getTotalSpent = (orders: Order[]) => {
    return orders.map(each => each.amount).reduce((sum, x) => sum + x, 0);
  }

  activateFilter = () => {
    this.trackerConfig.filter.isActive = true;
    return this;
  }

  setDateFilter = (dateFilter: DateFilter) => this.trackerConfig.filter.dateFilter = dateFilter;

}
