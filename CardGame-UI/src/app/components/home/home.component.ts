import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { TokenStorageService } from '../../services/token-storage-service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toastr: any;
  cards : any;
  currentCard = null;
  currentIndex = -1;
  
  constructor(private apiService: ApiService, private tokenService: TokenStorageService, private commonService: CommonService) {
    this.toastr = this.commonService.getToaster();
  }

  ngOnInit(): void {
    this.retrieveCards();
  }

  retrieveCards(){
    let userId = this.tokenService.getUser().id;
    this.apiService.dashboard(userId).subscribe(
      data => {
        this.cards = data.cards;
      },
      err => {
        this.toastr.error("Please reload page", "Failed");
      }
    );
  }

  setActiveCard(card, index) {
    this.currentCard = card;
    this.currentIndex = index;
  }
}
