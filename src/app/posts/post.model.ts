export interface Post {
  id: string;
  title: string;
  content: string;
  creator: string;
}

export interface Posts extends Array<Post> {}
