import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User, UserRole } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  
  private mockUsers: User[] = [
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'Hogar360',
      correo: 'admin@hogar360.com',
      role: UserRole.ADMIN,
      documento_identidad: '12345678',
      celular: '+573001234567',
      fecha_nacimiento: new Date('1985-01-01'),
      created_at: new Date()
    },
    {
      id: 2,
      nombre: 'Juan',
      apellido: 'Vendedor',
      correo: 'vendedor@hogar360.com',
      role: UserRole.VENDEDOR,
      documento_identidad: '87654321',
      celular: '+573007654321',
      fecha_nacimiento: new Date('1990-05-15'),
      created_at: new Date()
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'Compradora',
      correo: 'comprador@hogar360.com',
      role: UserRole.COMPRADOR,
      documento_identidad: '11223344',
      celular: '+573009876543',
      fecha_nacimiento: new Date('1988-12-10'),
      created_at: new Date()
    }
  ];

  /**
   * Mock login method
   * Credenciales de prueba:
   * - admin@hogar360.com / admin123
   * - vendedor@hogar360.com / vendedor123  
   * - comprador@hogar360.com / comprador123
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const { correo, clave } = credentials;
    
    // Simular delay de red
    return of(null).pipe(
      delay(800),
      switchMap(() => {
        // Validar credenciales mock
        const validCredentials = [
          { email: 'admin@hogar360.com', password: 'admin123', userId: 1 },
          { email: 'vendedor@hogar360.com', password: 'vendedor123', userId: 2 },
          { email: 'comprador@hogar360.com', password: 'comprador123', userId: 3 }
        ];

        const validUser = validCredentials.find(
          cred => cred.email === correo && cred.password === clave
        );

        if (!validUser) {
          return throwError(() => ({
            error: 'Credenciales inválidas',
            status: 401
          }));
        }

        const user = this.mockUsers.find(u => u.id === validUser.userId)!;
        
        const mockResponse: LoginResponse = {
          user,
          access_token: `mock-jwt-token-${user.id}-${Date.now()}`,
          refresh_token: `mock-refresh-token-${user.id}-${Date.now()}`,
          expires_in: 3600
        };

        return of(mockResponse);
      })
    );
  }
}
