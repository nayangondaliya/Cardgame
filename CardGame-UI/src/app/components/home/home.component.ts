import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { TokenStorageService } from '../../services/token-storage-service';
import { CommonService } from '../../services/common.service';
import * as io from 'socket.io-client';

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
  socket;

  constructor(private apiService: ApiService, private tokenService: TokenStorageService, private commonService: CommonService) {
    this.toastr = this.commonService.getToaster();
    this.socket = io("http://localhost:3000");
  }

  ngOnInit(): void {
    this.retrieveDashboardDetail();
    this.socket.on('newFriend', () => {
      this.retrieveDashboardDetail();
    });
    this.socket.on('newTrade', () => {
      this.retrieveDashboardDetail();
    });
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
}
