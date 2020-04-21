import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  toastr: any;
  passwordError = false;

  constructor(private apiService: ApiService, private commonService: CommonService, private router: Router) {
    this.toastr = commonService.getToaster();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    let password = this.form.password;
    let confirmPassword = this.form.confirmPassword;

    if(password != confirmPassword)
    {
      this.passwordError = true;
      return;
    }

    this.apiService.register(this.form).subscribe(
      data => {
        if(data.code == '000')
        {
          this.toastr.success(data.message, "Success");
          this.router.navigate(['/login']);
        }
        else
        {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  validatePassword(){
    let password = this.form.password;
    let confirmPassword = this.form.confirmPassword;

    if(password != confirmPassword)
      this.passwordError = true;
    else
      this.passwordError = false;
  }
}
