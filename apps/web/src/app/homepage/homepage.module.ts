import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage.component';
import { routes } from './homepage.routing';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [HomepageComponent]
})
export class HomepageModule {}
