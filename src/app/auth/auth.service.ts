import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };

    return this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.redirectTo('/');
      },
      (err) => {
        this.authStatusListener.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          this.token = response.token;
          if (!this.token) return;

          const expiersInDuration = response.expiresIn;
          this.setAuthTimer(expiersInDuration);
          this.isAuth = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiersInDuration * 1000
          );

          this.saveAuthData(this.token, expirationDate, this.userId);
          this.redirectTo('/');
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();

    if (
      !authInformation?.expirtaionDate ||
      !authInformation.token ||
      !authInformation.userId
    )
      return;
    const expiresIn = authInformation.expirtaionDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
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
    this.userId = '';

    this.redirectTo('/login');
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);

    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/login', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirtaionDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirtaionDate) return;

    return {
      token,
      expirtaionDate: new Date(expirtaionDate),
      userId,
    };
  }
}
