import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMatModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],

  imports: [
    FormsModule,
    AngularMatModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    AngularMatModule,
    RouterModule,
  ],
})
export class PostsModule {}
