import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [CommonModule, RouterModule, FlexLayoutModule, MatSidenavModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent]
})
export class LayoutModule {}
