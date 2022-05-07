import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onLogIn(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }
}