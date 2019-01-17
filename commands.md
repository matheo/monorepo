Store Root
ng generate @ngrx/schematics:store app --module=app.module.ts --no-flat --no-spec --root --stateInterface=AppState --statePath=store

Effects Router
ng generate @ngrx/schematics:effect store/router --module=app.module.ts --no-flat --no-spec --root

Action App
ng generate @ngrx/schematics:action store/lang --group
