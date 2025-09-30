export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  photo_url?: string;
  role?: string;
  roles?: string[];
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  user: User;
  sessionId: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
  message?: string;
  user?: User;
}

export type UserType = 'participant' | 'coach' | 'sponsor';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  userType: UserType;
}
