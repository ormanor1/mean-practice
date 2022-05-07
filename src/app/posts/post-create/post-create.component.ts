import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  userId = '';
  private mode = 'create';
  private postId: string = '';
  public post: Post;
  isLoading = false;

  constructor(
    private postService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';

        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            creator: postData.creator,
          };
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onSavePost(form: NgForm): void {
    if (form.invalid) return;

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.title);

      form.resetForm();
    } else {
      this.postService.updatePost(
        this.post.id,
        form.value.title,
        form.value.title
      );
    }
  }
}
