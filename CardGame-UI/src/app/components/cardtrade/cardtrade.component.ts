import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { TokenStorageService } from '../../services/token-storage-service';
import { CommonService } from '../../services/common.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-cardtrade',
  templateUrl: './cardtrade.component.html',
  styleUrls: ['./cardtrade.component.css']
})
export class CardtradeComponent implements OnInit {

  toastr: any;
  sentRequests: any = [];
  pendingRequests: any = [];
  friends: any = [];
  cards: any = [];
  currentFriend: any = {};
  currentFriendIndex = -1;
  senderId: any;
  receiverId: any;
  senderCards: any = [];
  receiverCards: any = [];
  userId: any;
  senderInfo: any = [];
  receiverInfo: any = [];
  isView: boolean = false;
  socket;

  constructor(private apiService: ApiService, private tokenService: TokenStorageService, private commonService: CommonService) {
    this.toastr = this.commonService.getToaster();
    this.socket = io("http://localhost:3000");
  }

  ngOnInit(): void {
    this.userId = this.tokenService.getUser().id;
    this.resettradeinfo();

    this.retrieveDashboardDetail();
    this.socket.on('newFriend', () => {
      this.retrieveDashboardDetail();
    });
    this.socket.on('newTrade', () => {
      this.retrieveDashboardDetail();
    });
  }

  retrieveDashboardDetail() {
    this.apiService.tradedashboard(this.userId).subscribe(
      data => {
        if (data.code == "000") {
          this.friends = data.friends;
          this.cards = data.cards;
          this.sentRequests = data.sentRequests;
          this.pendingRequests = data.pendingRequests;
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error("Please refresh page", "Error");
      }
    );
  }

  cancel(tradeId) {
    this.closeview();
    this.apiService.canceltrade(tradeId).subscribe(
      data => {
        if (data.code == "000") {
          this.toastr.success(data.message, "Success");
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error("Please try again", "Error");
      }
    );
  }

  accept(tradeId) {
    this.closeview();
    this.apiService.accepttrade(tradeId).subscribe(
      data => {
        if (data.code == "000") {
          this.toastr.success(data.message, "Success");
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error("Please try again", "Error");
      }
    );
  }

  view(tradeId, type) {
    this.resettradeinfo();
    this.isView = true;

    this.apiService.viewtrade(tradeId).subscribe(
      data => {
        if (data.code == "000") {
          if (type === 0) {
            this.cards = data.sender.cards;
            this.currentFriend.cards = data.receiver.cards;
          }
          else {
            this.cards = data.receiver.cards;
            this.currentFriend.cards = data.sender.cards;
          }
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error("Please try again", "Error");
      }
    );
  }

  send() {
    this.senderId = this.userId;

    if (this.receiverId === '') {
      this.toastr.error("Receiver is not selected", "Failed");
      return;
    }

    if (this.senderCards.length == 0 && this.receiverCards.length == 0) {
      this.toastr.error("No cards for exchange", "Failed");
      return;
    }

    this.apiService.sendtrade(this.senderId, this.receiverId, this.senderCards, this.receiverCards).subscribe(
      data => {
        if (data.code == "000") {
          this.toastr.success(data.message, "Success");
          this.setActiveFriend({}, -1);
        }
        else {
          this.toastr.error(data.message, "Failed");
        }
      },
      err => {
        this.toastr.error("Please try again", "Error");
      }
    );

    this.resettradeinfo();
  }

  setActiveFriend(friend, index) {
    this.currentFriend = friend;
    this.currentFriendIndex = index;
    this.resettradeinfo();
    this.receiverId = this.currentFriend.id;
  }

  resettradeinfo() {
    this.senderId = '';
    this.receiverId = '';
    this.senderCards = [];
    this.receiverCards = [];
  }

  setsendercard(cardId) {

    const index = this.senderCards.indexOf(cardId, 0);

    if (index > -1) {
      this.senderCards.splice(index, 1);
    }
    else {
      this.senderCards.push(cardId);
    }
  }

  setreceivercard(cardId) {

    const index = this.receiverCards.indexOf(cardId, 0);

    if (index > -1) {
      this.receiverCards.splice(index, 1);
    }
    else {
      this.receiverCards.push(cardId);
    }
  }

  closeview() {
    this.isView = false;
    this.setActiveFriend({}, -1);
    this.resettradeinfo();
    this.retrieveDashboardDetail();
  }
}
