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

  dashboard(userId) : Observable<any>{
    return this.http.post(API_URL + 'user/home', {
      id: userId
    }, httpOptions);
  }
}
