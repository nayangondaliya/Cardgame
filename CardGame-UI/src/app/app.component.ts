import { Component } from '@angular/core';
import { TokenStorageService } from './services/token-storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CardGame';

  isLoggedIn = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService) {
    this.verifyLogin();
  }

  ngOnInit() {
    this.verifyLogin();
  }

  verifyLogin() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
