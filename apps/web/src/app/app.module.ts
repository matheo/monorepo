import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxModule } from '@nrwl/nx';
import { environment } from '../environments/environment';

import { EffectsModule } from '@ngrx/effects';
import {
  NavigationActionTiming,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { effects, reducers, metaReducers, RouterSerializer } from './store';

import { LayoutModule } from '@matheo/layout';
import { HomepageModule } from './homepage/homepage.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({
      serializer: RouterSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    LayoutModule,
    HomepageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
