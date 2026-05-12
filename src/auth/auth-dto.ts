export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
};


export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export type LoginResDTO = { token: string };
export type RefreshResDTO = { token?: string; accessToken?: string };
export type RegisterResDTO = {
  id?: string | number;
  email?: string;
  role?: 'USER' | 'ADMIN';
  accessToken?: string;
  token?: string;
};

export type AuthErrors<T> = Partial<Record<keyof T, string>>;

export function validateLogin(values: LoginPayload): AuthErrors<LoginPayload> {
  const errors: AuthErrors<LoginPayload> = {};
  if (!values.email) errors.email = 'Email requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email invalide';
  if (!values.password) errors.password = 'Mot de passe requis';
  return errors;
}

export function validateRegister(values: RegisterPayload): AuthErrors<RegisterPayload> {
  const errors: AuthErrors<RegisterPayload> = {};
  if (!values.name) errors.name = 'Prenom requis';
  if (!values.lastname) errors.lastname = 'Nom requis';
  if (!values.email) errors.email = 'Email requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email invalide';
  if (!values.password) errors.password = 'Mot de passe requis';
  else if (values.password.length < 6) errors.password = 'Minimum 6 caracteres';
  if (!values.confirmPassword) errors.confirmPassword = 'Confirmation requise';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  return errors;
}