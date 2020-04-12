import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { CommonService } from '../../services/common.service';
import { TokenStorageService } from '../../services/token-storage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  toastr: any;

  constructor(private apiService: ApiService, 
              private tokenStorage: TokenStorageService, 
              private commonService: CommonService,
              private router: Router) {
    this.toastr = commonService.getToaster();
  }

  ngOnInit(): void {
    this.redirectToHomePage()
  }

  onSubmit() {
    this.apiService.login(this.form).subscribe(
      data => {
        if (data.code == '000') {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.redirectToHomePage()
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error(err.error.message, "Failed");
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

  redirectToHomePage()
  {
    if(this.tokenStorage.getToken())
      window.location.href = "/home";
  }
}
