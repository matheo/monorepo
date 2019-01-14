import { Action } from '@ngrx/store';

export enum LangActionTypes {
  LoadLangs = '[Lang] Load Langs'
}

export class LoadLangs implements Action {
  readonly type = LangActionTypes.LoadLangs;
}

export type LangActions = LoadLangs;
