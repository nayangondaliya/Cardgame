import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(API_URL + 'auth/signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(API_URL + 'auth/signup', {
      username: user.username,
      password: user.password
    }, httpOptions);
  }

  dashboard(userId): Observable<any> {
    return this.http.post(API_URL + 'user/home', {
      id: userId
    }, httpOptions);
  }

  searchUser(user, userId): Observable<any> {
    return this.http.post(API_URL + 'user/searchuser', {
      username: user, id: userId
    }, httpOptions);
  }

  sendrequest(userId, friendId): Observable<any> {
    return this.http.post(API_URL + 'user/addfriend', {
      id: userId, friendId: friendId
    }, httpOptions);
  }

  getrequests(userId): Observable<any> {
    return this.http.post(API_URL + 'user/getrequests', {
      id: userId
    }, httpOptions);
  }

  acceptrequest(userId, friendId): Observable<any> {
    return this.http.post(API_URL + 'user/acceptrequest', {
      id: userId, friendId: friendId
    }, httpOptions);
  }

  cancelrequest(userId, friendId): Observable<any> {
    return this.http.post(API_URL + 'user/cancelrequest', {
      id: userId, friendId: friendId
    }, httpOptions);
  }

  cancelpendingrequest(userId, friendId): Observable<any> {
    return this.http.post(API_URL + 'user/cancelpendingrequest', {
      id: userId, friendId: friendId
    }, httpOptions);
  }

  tradedashboard(userId): Observable<any> {
    return this.http.post(API_URL + 'trade/dashboard', { userId: userId }, httpOptions);
  }

  canceltrade(tradeId): Observable<any> {
    return this.http.post(API_URL + 'trade/cancel', { tradeId: tradeId }, httpOptions);
  }

  sendtrade(senderId, receiverId, senderCards, receiverCards): Observable<any> {
    return this.http.post(API_URL + 'trade/send', {
      senderId: senderId,
      receiverId: receiverId,
      senderCards: senderCards,
      receiverCards: receiverCards
    }, httpOptions);
  }

  accepttrade(tradeId) : Observable<any>{
    return this.http.post(API_URL + 'trade/accept', { tradeId: tradeId }, httpOptions);
  }

  viewtrade(tradeId) : Observable<any>{
    return this.http.post(API_URL + 'trade/view', { tradeId: tradeId }, httpOptions);
  }
}
