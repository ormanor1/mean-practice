import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onSignUp(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
