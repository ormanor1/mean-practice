import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  private url = 'http://localhost:3000/api/users';
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http.post(this.url + '/signup', authData).subscribe((response) => {});
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(this.url + '/login', authData)
      .subscribe((response) => {
        this.token = response.token;
        if (!this.token) return;
        const expiersInDuration = response.expiresIn;
        this.setAuthTimer(expiersInDuration);
        this.isAuth = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiersInDuration * 1000
        );

        this.saveAuthData(this.token, expirationDate);
        this.redirectTo('/');
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();

    if (!authInformation?.expirtaionDate || !authInformation.token) return;
    const expiresIn = authInformation.expirtaionDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logoutUser() {
    this.token = '';
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.redirectTo('/');
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);

    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private redirectTo(uri: string) {
    this.router
      .navigateByUrl('/login', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirtaionDate = localStorage.getItem('expiration');
    if (!token || !expirtaionDate) return;

    return {
      token,
      expirtaionDate: new Date(expirtaionDate),
    };
  }
}
