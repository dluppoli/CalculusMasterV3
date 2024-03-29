import { Routes } from "@angular/router";
import { NumeriprimiComponent } from "../numeriprimi/numeriprimi.component";
import { PigrecoComponent } from "../pigreco/pigreco.component";
import { authGuard } from "../auth.guard";
import { InfoComponent } from "../info/info.component";

export const BackendRoutes: Routes = [
    {path:'numeriprimi', component:NumeriprimiComponent},
    {path:'pigreco', component:PigrecoComponent},
    {path:'info', component:InfoComponent}
]