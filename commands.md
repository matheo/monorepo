ANGULAR

Module
ng generate @schematics/angular:module datepicker --project=web --module=app.module.ts --routing --lintFix

Component
ng generate @schematics/angular:component menu --project=layout --module=layout.module.ts --style=scss --skipTests --lintFix

NGRX

Store Root
ng generate @ngrx/schematics:store app --module=app.module.ts --no-flat --no-spec --root --stateInterface=AppState --statePath=store

Effects Router
ng generate @ngrx/schematics:effect store/router --module=app.module.ts --no-flat --no-spec --root

Action App
ng generate @ngrx/schematics:action store/lang --group
