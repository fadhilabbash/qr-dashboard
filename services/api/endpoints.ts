export const ENDPOINTS = {
  //📌Auth
  login: "/login",
  me: "/me",
  refresh: "/refresh",

  //📌Users
  users: "/users",
  createUser: "/users",
  updateUser: (id: number | string) => `/users/${id}`,
  getUser: (id: number | string) => `/users/${id}`,
  deleteUser: (id: number | string) => `/users/${id}`,
  updateUserPassword: (id: number | string) => `/users/${id}/change-password`,
  getRoles: "/roles",

  //📌Tags
  tags: "/tags",
  createTag: "/tags",
  updateTag: (id: number | string) => `/tags/${id}`,
  getTag: (id: number | string) => `/tags/${id}`,
  deleteTag: (id: number | string) => `/tags/${id}`,
  getTagsByType: (type: string) => `/tags/type/${type}`,

  //📌Videos
  videos: "/videos",
  createVideo: "/videos",
  updateVideo: (id: number | string) => `/videos/${id}`,
  getVideo: (id: number | string) => `/videos/${id}`,
  deleteVideo: (id: number | string) => `/videos/${id}`,

  //📌Posts
  posts: "/posts",
  createPost: "/posts",
  updatePost: (id: number | string) => `/posts/${id}`,
  getPost: (id: number | string) => `/posts/${id}`,
  deletePost: (id: number | string) => `/posts/${id}`,

  //📌Articles
  articles: "/articles",
  createArticle: "/articles",
  updateArticle: (id: number | string) => `/articles/${id}`,
  getArticle: (id: number | string) => `/articles/${id}`,
  deleteArticle: (id: number | string) => `/articles/${id}`,
};
