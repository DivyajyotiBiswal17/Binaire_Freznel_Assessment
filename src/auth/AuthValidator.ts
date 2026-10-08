export type Field = "name" | "email" | "password" | "confirm";
export type FieldErrors = Partial<Record<Field, string>>;

export interface Credentials { name: string; email: string; password: string; confirm: string; }

export class AuthValidator {
  private static readonly emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  static email(v: string): string | undefined {
    if (!v.trim()) return "Enter your email address.";
    if (!this.emailRe.test(v.trim())) return "Enter a valid email address.";
  }

  static signIn(c: Credentials): FieldErrors {
    const e: FieldErrors = {};
    const email = this.email(c.email);
    if (email) e.email = email;
    if (!c.password) e.password = "Enter your password.";
    return e;
  }

  static signUp(c: Credentials): FieldErrors {
    const e: FieldErrors = {};
    if (c.name.trim().length < 2) e.name = "Enter your name (at least 2 characters).";
    const email = this.email(c.email);
    if (email) e.email = email;
    if (c.password.length < 6) e.password = "Use at least 6 characters.";
    if (c.confirm !== c.password) e.confirm = "Passwords don't match.";
    return e;
  }
}