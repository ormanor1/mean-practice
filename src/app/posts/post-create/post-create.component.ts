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
          };
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onSavePost(form: NgForm): void {
    const title = form.value.title;
    const content = form.value.title;
    this.isLoading = true;
    if (form.invalid) return;

    if (this.mode === 'create') {
      this.postService.addPost(title, content);

      form.resetForm();
    } else {
      this.postService.updatePost(this.post.id, title, content);
    }
  }
}
