import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './datepicker.routing';

import { DemoComponent } from './demo/demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class DatepickerModule {}
