export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_role: string;
  created_at: Date | undefined;

  constructor() {
    this.id = NaN;
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.user_role = '';
    this.created_at = undefined;
  }
}
