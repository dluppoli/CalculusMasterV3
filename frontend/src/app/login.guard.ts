import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  var token = localStorage.getItem('token');
  if( token ) {
    inject(Router).navigate(['/'])
    return false;
  }
  return true;
};
