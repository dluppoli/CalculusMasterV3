import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  var token = localStorage.getItem('token');
  if( !token ) {
    inject(Router).navigate(['/login'])
    return false;
  }
  return true;
};
