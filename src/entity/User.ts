export interface User {
  id?: number;
  github_id: number;
  login: string;
  name?: string;
  location?: string;
  meta_data?: object;
  created_at?: Date;
  updated_at?: Date;
}