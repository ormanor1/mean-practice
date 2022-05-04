import { PostsService } from './../posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Posts } from './../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Posts = [];
  private postsSub!: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Posts) => {
        this.posts = posts;
      });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
