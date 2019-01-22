/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MatDateFormats} from '@matheo/datepicker/core';


export const MAT_LUXON_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd/LL/yyyy',
  },
  display: {
    dateInput: 'dd/LL/yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLL yyyy',
  },
};
