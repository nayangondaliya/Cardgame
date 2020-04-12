import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenStorageService } from './token-storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private tokenService: TokenStorageService, public router: Router) { }
  canActivate(): boolean {
    
    const token = this.tokenService.getToken();
    let isAuthenticated = false;

    if(token)
      isAuthenticated = true;
    else
      isAuthenticated = false;

    if (!isAuthenticated) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
