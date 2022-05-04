export interface Post {
  id: string;
  title: string;
  content: string;
}

export interface Posts extends Array<Post> {}
