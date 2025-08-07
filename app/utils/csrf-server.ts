import csrfProtection from './csrf';

export function generateCSRFToken(): string {
  return csrfProtection.generateToken();
}

export function validateCSRFToken(token: string): boolean {
  return csrfProtection.verifyToken(token);
}