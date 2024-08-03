import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const isActive = localStorage.getItem('token');
  const _login= inject(LoginService);
  console.log(state.url);

  const router = new Router();


  if(_login.isLogedIn.value || isActive != null || isActive != undefined) {
    return true;
  }else{ 
    router.navigate(['login'])
    return false;
  }
};
