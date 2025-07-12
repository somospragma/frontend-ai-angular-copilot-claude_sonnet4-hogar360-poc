export interface User {
  id: number;
  nombre: string;
  apellido: string;
  documento_identidad: string;
  celular: string;
  fecha_nacimiento: Date;
  correo: string;
  role: UserRole;
  avatar?: string;
  created_at?: Date;
  updated_at?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
  COMPRADOR = 'comprador'
}

export interface UserRequest {
  nombre: string;
  apellido: string;
  documento_identidad: string;
  celular: string;
  fecha_nacimiento: Date;
  correo: string;
  clave: string;
}

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}
