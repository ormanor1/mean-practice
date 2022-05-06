import { Post, Posts } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Posts = [];
  private postsUpdated = new Subject<Posts>();
  url = 'http://localhost:3000/api/posts/';
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.url)
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      this.url + id
    );
  }

  addPost(title: string, content: string): void {
    const post: Post = { id: 'undefined', title, content };

    this.http
      .post<{ message: string; postId: string }>(this.url, post)
      .subscribe((resData) => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.navigateOnSave();
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };

    this.http.put(this.url + id, post).subscribe((res) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);

      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;

      this.postsUpdated.next([...this.posts]);
      this.navigateOnSave();
    });
  }

  deletePost(postId: string): void {
    this.http.delete(this.url + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => {
        return post.id !== postId;
      });
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  navigateOnSave() {
    this.router.navigate(['']);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
