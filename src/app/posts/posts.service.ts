import { Post, Posts } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Posts = [];
  private postsUpdated = new Subject<{ posts: Posts; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getUserId() {}

  addPost(title: string, content: string): void {
    const post: Post = { id: 'undefined', title, content, creator: '' };

    this.http
      .post<{ message: string; postId: string }>(BACKEND_URL, post)
      .subscribe((resData) => {
        this.navigateOnSave();
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, creator: '' };

    this.http.put(BACKEND_URL + id, post).subscribe((res) => {
      this.navigateOnSave();
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  navigateOnSave() {
    this.router.navigate(['']);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
