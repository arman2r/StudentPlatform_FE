export interface IAuthState {
  token: string | null;
  user: { id: string; email: string } | null;
}