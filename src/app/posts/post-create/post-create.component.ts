import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  constructor(private postService: PostsService) {}

  ngOnInit(): void {}

  onPostCreate(form: NgForm): void {
    const title = form.value.title;
    const content = form.value.title;

    if (form.invalid) return;
    this.postService.addPost('', title, content);
    form.resetForm();
  }
}
