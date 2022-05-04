import { Post, Posts } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Posts = [];
  private postsUpdated = new Subject<Posts>();
  url = 'http://localhost:3000/api/posts';
  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ id: string; message: string; posts: Posts }>(this.url)
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(id: string, title: string, content: string): void {
    const post: Post = { id: '', title, content };

    this.http.post<{ message: string }>(this.url, post).subscribe((resData) => {
      console.log(resData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
