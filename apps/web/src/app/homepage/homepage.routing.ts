import { Routes } from '@angular/router';
import { LayoutComponent } from '@matheo/layout';

import { HomepageComponent } from './homepage.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomepageComponent
      }
    ]
  }
];
