import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { TokenStorageService } from '../../services/token-storage-service';
import { CommonService } from '../../services/common.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  toastr: any;
  name: '';
  people: any = [];
  userCount: Number = 0;
  sentRequests: any = [];
  pendingRequests: any = [];
  friends: any = [];
  subscription: Subscription;
  intervalId: number;
  intervaltime: number = 1000;

  constructor(private apiService: ApiService, private tokenService: TokenStorageService, private commonService: CommonService) {
    this.toastr = this.commonService.getToaster();
  }

  ngOnInit(): void {
    const source = interval(this.intervaltime);
    this.subscription = source.subscribe(val => this.getDashboardDetail());
  }

  getDashboardDetail() {
    const userId = this.tokenService.getUser().id;

    this.apiService.getrequests(userId).subscribe(
      data => {
        if (data.code == '000') {
          this.sentRequests = data.sentRequests;
          this.pendingRequests = data.pendingRequests
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }

  searchPeople(username) {
    if (username == '' || username == undefined) {
      this.userCount = 0;
      this.people = [];
      return;
    }

    const userId = this.tokenService.getUser().id;
    this.apiService.searchUser(username, userId).subscribe(
      data => {
        if (data.code == '000') {
          this.userCount = data.users.length;
          this.people = data.users;
          this.friends = data.friends;
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }

  addFriend(friendId) {
    const userId = this.tokenService.getUser().id;
    const isFriend = this.friends.filter(x => x.id == friendId);
    const isPending = this.pendingRequests.filter(x => x.id == friendId);
    const isSent = this.sentRequests.filter(x => x.id == friendId);

    if (userId == friendId) {
      this.toastr.error("Cant' send request to self", 'Failed');
      return;
    }
    else if (isFriend.length > 0) {
      this.toastr.error("You are already friends", 'Failed');
      return;
    }
    else if (isPending.length > 0) {
      this.toastr.error("User's request is pending", 'Failed');
      return;
    }
    else if (isSent.length > 0) {
      this.toastr.error("Already sent the request", 'Failed');
      return;
    }

    this.apiService.sendrequest(userId, friendId).subscribe(
      data => {
        if (data.code == 'R01') {
          this.toastr.success(data.message, 'Success');
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }

  acceptRequest(friendId) {
    const userId = this.tokenService.getUser().id;

    this.apiService.acceptrequest(userId, friendId).subscribe(
      data => {
        if (data.code == 'R03') {
          this.toastr.success(data.message, 'Success');
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }

  cancelRequest(friendId) {
    const userId = this.tokenService.getUser().id;

    this.apiService.cancelrequest(userId, friendId).subscribe(
      data => {
        if (data.code == 'R02') {
          this.toastr.success(data.message, 'Success');
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }

  cancelPendingRequest(friendId) {
    const userId = this.tokenService.getUser().id;

    this.apiService.cancelpendingrequest(userId, friendId).subscribe(
      data => {
        if (data.code == 'R02') {
          this.toastr.success(data.message, 'Success');
        }
        else
          this.toastr.error(data.message, 'Failed');
      },
      err => {
        this.toastr.error("Please try again", 'Error');
      }
    );
  }
}
