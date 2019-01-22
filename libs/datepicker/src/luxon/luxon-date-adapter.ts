/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, Optional, InjectionToken} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@matheo/datepicker/core';

import { DateTime, Info, Settings } from 'luxon';

/** Configurable options for {@see LuxonDateAdapter}. */
export interface MatLuxonDateAdapterOptions {
  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker output dates.
   * {@default false}
   */
  useUtc: boolean;
}

/** InjectionToken for moment date adapter to configure options. */
export const MAT_LUXON_DATE_ADAPTER_OPTIONS = new InjectionToken<MatLuxonDateAdapterOptions>(
  'MAT_LUXON_DATE_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: MAT_LUXON_DATE_ADAPTER_OPTIONS_FACTORY
});


/** @docs-private */
export function MAT_LUXON_DATE_ADAPTER_OPTIONS_FACTORY(): MatLuxonDateAdapterOptions {
  return {
    useUtc: false
  };
}


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}


/** Adapts Luxon Dates for use with Angular Material. */
@Injectable()
export class LuxonDateAdapter extends DateAdapter<DateTime> {
  // Note: all of the methods that accept a `DateTime` input parameter immediately call `this.clone`
  // on it. This is to ensure that we're working with a `DateTime` that has the correct locale
  // setting while avoiding mutating the original object passed to us.

  private _localeData: {
    firstDayOfWeek: number,
    dates: string[]
  };

  get useUtc(): boolean {
    return this.options && this.options.useUtc;
  }

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional() @Inject(MAT_LUXON_DATE_ADAPTER_OPTIONS)
    private options?: MatLuxonDateAdapterOptions) {

    super();
    this.setLocale(dateLocale || Settings.defaultLocale);
  }

  setLocale(locale: string) {
    super.setLocale(locale);

    this._localeData = {
      firstDayOfWeek: 0,
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).toFormat('d'))
    };
  }

  getYear(date: DateTime): number {
    return this.clone(date).year;
  }

  getMonth(date: DateTime): number {
    // adjust the 1-indexed month
    return this.clone(date).month - 1;
  }

  getDate(date: DateTime): number {
    return this.clone(date).day;
  }

  getDayOfWeek(date: DateTime): number {
    return this.clone(date).weekday;
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return Info.months(style, { locale: this.locale });
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return Info.weekdays(style, { locale: this.locale });
  }

  getYearName(date: DateTime): string {
    return this.clone(date).toFormat('yyyy');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: DateTime): number {
    return this.clone(date).daysInMonth;
  }

  clone(date: DateTime): DateTime {
    return date.setLocale(this.locale);
  }

  createDate(year: number, month: number, day: number): DateTime {
    // DateTime.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (day < 1) {
      throw Error(`Invalid day "${day}". Date has to be greater than 0.`);
    }

    const result = this._createDateTime({year, month: month + 1, day});

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid) {
      throw Error(`Invalid day "${day}" for month with index "${month}".`);
    }

    return result;
  }

  today(): DateTime {
    return this._createDateTime();
  }

  parse(value: any, parseFormat: string | string[]): DateTime | null {
    if (DateTime.isDateTime(value)) {
      return this.clone(value);
    }
    if (value && typeof value === 'number') {
      const fromTimestamp = DateTime.fromMillis(value);
      if (fromTimestamp.isValid) {
        return fromTimestamp;
      }
    }
    if (value && typeof value === 'string') {
      if (parseFormat) {
        const fromFormat = DateTime.fromFormat(value, parseFormat, this._options(false)).setLocale(this.locale);
        if (fromFormat.isValid) {
          return fromFormat;
        }
      }
      const fromIso = DateTime.fromISO(value, this._options());
      if (fromIso.isValid) {
        return fromIso;
      }
    }
    return value ? this.deserialize(value) : null;
  }

  format(date: DateTime, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('LuxonDateAdapter: Cannot format invalid date.');
    }
    return date.toFormat(displayFormat);
  }

  formatLocale(date: DateTime, displayFormat: string): string {
    date = this.clone(date);
    if (!date.isValid) {
      throw Error('LuxonDateAdapter: Cannot format invalid date.');
    }
    return date.toLocaleString(displayFormat);
  }

  addCalendarYears(date: DateTime, years: number): DateTime {
    return this.clone(date).plus({years});
  }

  addCalendarMonths(date: DateTime, months: number): DateTime {
    return this.clone(date).plus({months});
  }

  addCalendarDays(date: DateTime, days: number): DateTime {
    return this.clone(date).plus({days});
  }

  toIso8601(date: DateTime): string {
    return this.clone(date).toISO();
  }

  /**
   * Returns the given value if given a valid DateTime or null. Deserializes valid ISO 8601 strings
   * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid DateTimes and empty
   * string into null. Returns an invalid date for all other values.
   */
  deserialize(value: any): DateTime | null {
    if (value === null) {
      return value;
    }

    let date;
    if (value instanceof Date) {
      date = DateTime.fromJSDate(value, this._options(false)).setLocale(this.locale);
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }

    if (typeof value === 'string') {
      if (!value) {
        return null;
      }

      date = DateTime.fromISO(value, this._options());

      if (!date.isValid) {
        date = DateTime.fromSQL(value, this._options());
      }
      if (!date.isValid) {
        date = DateTime.fromRFC2822(value, this._options());
      }
    }
    if (date && date.isValid) {
      return date;
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return DateTime.isDateTime(obj);
  }

  isValid(date: DateTime): boolean {
    return date.isValid;
  }

  invalid(): DateTime {
    return DateTime.invalid('Invalid Luxon Date');
  }

  /** Creates a DateTime instance while respecting the current UTC settings. */
  private _createDateTime(args?: any): DateTime {
    return DateTime.fromObject({ ...args, ...this._options() });
  }

  private _options(withLocale = true) {
    const opts = { zone: this.useUtc ? 'utc' : 'local' };
    if (withLocale) {
      opts['locale'] = this.locale;
    }
    return opts;
  }
}
