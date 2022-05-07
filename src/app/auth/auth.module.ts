import { CommonModule } from '@angular/common';
import { AngularMatModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModul } from './auth-routing.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent],

  imports: [AngularMatModule, CommonModule, FormsModule, AuthRoutingModul],
})
export class AuthModule {}
