import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSubs: Subscription;
  public isAuth = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}
