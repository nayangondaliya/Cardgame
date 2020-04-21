import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toastr : ToastrService) { }

  getToaster() {
    return this.toastr;
  }
}
