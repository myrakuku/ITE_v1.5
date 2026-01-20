// types/post-admin.ts
export type PostAdminCreateInput = {
  Title?: string | null;
  SupTitle?: string | null;
  content?: string | null;
  img_url?: string[];
  video_url?: string[];
  author?: string | null;
};

export type PostAdminUpdateInput = Partial<PostAdminCreateInput> & {
  id: string;
};

export type PostAdminWithId = {
  id: string;
  Title: string | null;
  SupTitle: string | null;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  img_url: string[];
  video_url: string[];
  author: string | null;
};