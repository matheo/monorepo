import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions) {}
}
