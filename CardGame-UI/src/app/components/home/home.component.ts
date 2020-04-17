import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { TokenStorageService } from '../../services/token-storage-service';
import { CommonService } from '../../services/common.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toastr: any;
  cards: any;
  friends: any;
  currentCard = null;
  currentCardIndex = -1;
  currentFriend = null;
  currentFriendIndex = -1;
  subscription: Subscription;
  intervalId: number;
  intervaltime: number = 1000;

  constructor(private apiService: ApiService, private tokenService: TokenStorageService, private commonService: CommonService) {
    this.toastr = this.commonService.getToaster();
  }

  ngOnInit(): void {
    const source = interval(this.intervaltime);
    this.subscription = source.subscribe(val => this.retrieveDashboardDetail());
  }

  retrieveDashboardDetail() {
    let userId = this.tokenService.getUser().id;
    this.apiService.dashboard(userId).subscribe(
      data => {
        this.cards = data.cards;
        this.friends = data.friends;
      },
      err => {
        this.toastr.error("Please reload page", "Failed");
      }
    );
  }

  setActiveCard(card, index) {
    this.currentCard = card;
    this.currentCardIndex = index;
  }

  setActiveFriend(friend, index) {
    this.currentFriend = friend;
    this.currentFriendIndex = index;
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
}
