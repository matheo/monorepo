import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent
  }
];
