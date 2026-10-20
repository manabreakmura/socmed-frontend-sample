export type Post = {
  id: string;
  body: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    created_at: string;
    is_following: boolean;
  };
  total_likes: number;
  is_liked: boolean;
  is_bookmarked: boolean;
};

export type Comment = {
  id: string;
  body: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    created_at: string;
    is_following: boolean;
  };
};

export type User = {
  id: string;
  username: string;
  created_at: string;
  is_following: boolean;
};
