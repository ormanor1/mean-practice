export interface Post {
  title: string;
  content: string;
}

export interface Posts extends Array<Post> {}
