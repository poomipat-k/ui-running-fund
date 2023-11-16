export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  createdAt: Date | undefined;

  constructor() {
    this.id = NaN;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.userRole = '';
    this.createdAt = undefined;
  }
}
