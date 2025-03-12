export interface AuthResponse {
  message: string;
  data: {
    id: string;
    username: string;
    token: string;
  };
}
