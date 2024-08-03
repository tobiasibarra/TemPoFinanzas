import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { MetasComponent } from './components/metas/metas.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'inicio', component: InicioComponent, canActivate: [authGuard],
        children:[
            { path: "", component: DashboardComponent },
            { path: "registros", component: RegistrosComponent },
            { path: "presupuesto", component: PresupuestoComponent },
            { path: "contacto", component: ContactoComponent },
            { path: "metas", component: MetasComponent },
        ]
    },
];
