import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';

// HU #3: Interfaces basadas en criterios de aceptación
export interface Ubicacion {
  id: string;
  ciudad: string; // HU #3: máximo 50 caracteres
  departamento: string; // HU #3: máximo 50 caracteres, no se puede repetir
  descripcionCiudad: string; // HU #3: máximo 120 caracteres, obligatoria
  descripcionDepartamento: string; // HU #3: máximo 120 caracteres, obligatoria
  fechaCreacion: Date;
  activo: boolean;
}

export interface CreateUbicacionRequest {
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
}

export interface UbicacionResponse {
  success: boolean;
  message: string;
  ubicacion?: Ubicacion;
}

export interface SearchUbicacionParams {
  texto?: string; // HU #4: búsqueda por ciudad o departamento
  ordenAscendente?: boolean; // HU #4: ordenamiento
  ordenarPor?: 'ciudad' | 'departamento'; // HU #4: campo de ordenamiento
  page?: number; // HU #4: paginación
  pageSize?: number;
}

export interface SearchUbicacionResponse {
  ubicaciones: Ubicacion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  // Signals para manejo de estado
  readonly ubicaciones = signal<Ubicacion[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Simulación de base de datos
  private readonly ubicacionesDB = signal<Ubicacion[]>([
    {
      id: '1',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      descripcionCiudad: 'Capital de Colombia, centro político y económico del país',
      descripcionDepartamento: 'Departamento central de Colombia, rodea la capital',
      fechaCreacion: new Date('2024-01-01'),
      activo: true
    },
    {
      id: '2',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      descripcionCiudad: 'Ciudad de la eterna primavera, importante centro industrial',
      descripcionDepartamento: 'Departamento del noroeste de Colombia, región montañosa',
      fechaCreacion: new Date('2024-01-02'),
      activo: true
    }
  ]);

  // Constantes para validación según HU
  private readonly CIUDAD_MAX_LENGTH = 50;
  private readonly DEPARTAMENTO_MAX_LENGTH = 50;
  private readonly DESCRIPCION_MAX_LENGTH = 120;

  /**
   * HU #3: Crear ubicación (ciudad y departamento)
   * Criterios de aceptación:
   * - Ciudad máximo 50 caracteres
   * - Departamento máximo 50 caracteres, no se puede repetir
   * - Descripción ciudad obligatoria, máximo 120 caracteres
   * - Descripción departamento obligatoria, máximo 120 caracteres
   */
  createUbicacion(ubicacionData: CreateUbicacionRequest): Observable<UbicacionResponse> {
    this.loading.set(true);
    this.error.set(null);

    // Validaciones según HU #3
    const validationErrors = this.validateUbicacionData(ubicacionData);
    if (validationErrors.length > 0) {
      this.loading.set(false);
      this.error.set(validationErrors.join(', '));
      return of({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    // Verificar que el departamento no se repita
    if (this.isDepartamentoExists(ubicacionData.departamento)) {
      this.loading.set(false);
      this.error.set('El departamento ya existe');
      return of({
        success: false,
        message: 'El departamento ya existe'
      });
    }

    // Crear nueva ubicación
    const nuevaUbicacion: Ubicacion = {
      id: Date.now().toString(),
      ciudad: ubicacionData.ciudad.trim(),
      departamento: ubicacionData.departamento.trim(),
      descripcionCiudad: ubicacionData.descripcionCiudad.trim(),
      descripcionDepartamento: ubicacionData.descripcionDepartamento.trim(),
      fechaCreacion: new Date(),
      activo: true
    };

    // Simular llamada HTTP con delay
    return of({
      success: true,
      message: 'Ubicación creada exitosamente',
      ubicacion: nuevaUbicacion
    }).pipe(
      delay(500),
      tap(response => {
        if (response.success && response.ubicacion) {
          const currentUbicaciones = this.ubicacionesDB();
          this.ubicacionesDB.set([...currentUbicaciones, response.ubicacion]);
          this.ubicaciones.set(this.ubicacionesDB());
        }
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        this.error.set('Error al crear la ubicación');
        return of({
          success: false,
          message: 'Error al crear la ubicación'
        });
      })
    );
  }

  /**
   * HU #4: Buscar ubicaciones
   * Criterios de aceptación:
   * - Buscar por ciudad o departamento
   * - Ordenar ascendente o descendente por ciudad o departamento
   * - Mostrar resultados paginados
   */
  searchUbicaciones(params: SearchUbicacionParams = {}): Observable<SearchUbicacionResponse> {
    this.loading.set(true);
    this.error.set(null);

    const {
      texto = '',
      ordenAscendente = true,
      ordenarPor = 'ciudad',
      page = 1,
      pageSize = 10
    } = params;

    let resultados = [...this.ubicacionesDB()];

    // Filtrar por texto de búsqueda (ciudad o departamento)
    if (texto.trim()) {
      const textoBusqueda = texto.toLowerCase().trim();
      resultados = resultados.filter(ubicacion =>
        ubicacion.ciudad.toLowerCase().includes(textoBusqueda) ||
        ubicacion.departamento.toLowerCase().includes(textoBusqueda)
      );
    }

    // Ordenar según criterios
    resultados.sort((a, b) => {
      const valorA = a[ordenarPor].toLowerCase();
      const valorB = b[ordenarPor].toLowerCase();
      
      if (ordenAscendente) {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });

    // Paginación
    const total = resultados.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const ubicacionesPaginadas = resultados.slice(startIndex, endIndex);

    // Simular delay de red
    return of({
      ubicaciones: ubicacionesPaginadas,
      total,
      page,
      pageSize,
      totalPages
    }).pipe(
      delay(300),
      tap(response => {
        this.ubicaciones.set(response.ubicaciones);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        this.error.set('Error al buscar ubicaciones');
        throw error;
      })
    );
  }

  /**
   * Validar si un departamento ya existe
   */
  isDepartamentoExists(departamento: string): boolean {
    return this.ubicacionesDB().some(
      ubicacion => ubicacion.departamento.toLowerCase() === departamento.toLowerCase().trim()
    );
  }

  /**
   * Verificar si una ciudad ya existe en un departamento
   */
  isCiudadExistsInDepartamento(ciudad: string, departamento: string): boolean {
    return this.ubicacionesDB().some(
      ubicacion => 
        ubicacion.ciudad.toLowerCase() === ciudad.toLowerCase().trim() &&
        ubicacion.departamento.toLowerCase() === departamento.toLowerCase().trim()
    );
  }

  /**
   * Validaciones según criterios de aceptación HU #3
   */
  private validateUbicacionData(data: CreateUbicacionRequest): string[] {
    const errors: string[] = [];

    // Validar ciudad
    if (!data.ciudad || !data.ciudad.trim()) {
      errors.push('La ciudad es obligatoria');
    } else if (data.ciudad.trim().length > this.CIUDAD_MAX_LENGTH) {
      errors.push(`La ciudad no puede tener más de ${this.CIUDAD_MAX_LENGTH} caracteres`);
    }

    // Validar departamento
    if (!data.departamento || !data.departamento.trim()) {
      errors.push('El departamento es obligatorio');
    } else if (data.departamento.trim().length > this.DEPARTAMENTO_MAX_LENGTH) {
      errors.push(`El departamento no puede tener más de ${this.DEPARTAMENTO_MAX_LENGTH} caracteres`);
    }

    // Validar descripción ciudad
    if (!data.descripcionCiudad || !data.descripcionCiudad.trim()) {
      errors.push('La descripción de la ciudad es obligatoria');
    } else if (data.descripcionCiudad.trim().length > this.DESCRIPCION_MAX_LENGTH) {
      errors.push(`La descripción de la ciudad no puede tener más de ${this.DESCRIPCION_MAX_LENGTH} caracteres`);
    }

    // Validar descripción departamento
    if (!data.descripcionDepartamento || !data.descripcionDepartamento.trim()) {
      errors.push('La descripción del departamento es obligatoria');
    } else if (data.descripcionDepartamento.trim().length > this.DESCRIPCION_MAX_LENGTH) {
      errors.push(`La descripción del departamento no puede tener más de ${this.DESCRIPCION_MAX_LENGTH} caracteres`);
    }

    return errors;
  }

  /**
   * Obtener todas las ubicaciones
   */
  getAllUbicaciones(): Observable<Ubicacion[]> {
    return of(this.ubicacionesDB()).pipe(delay(200));
  }

  /**
   * Obtener ubicación por ID
   */
  getUbicacionById(id: string): Observable<Ubicacion | null> {
    const ubicacion = this.ubicacionesDB().find(u => u.id === id) || null;
    return of(ubicacion).pipe(delay(200));
  }

  /**
   * Eliminar ubicación
   */
  deleteUbicacion(id: string): Observable<UbicacionResponse> {
    const currentUbicaciones = this.ubicacionesDB();
    const index = currentUbicaciones.findIndex(u => u.id === id);

    if (index === -1) {
      return of({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }

    const updatedUbicaciones = currentUbicaciones.filter(u => u.id !== id);
    this.ubicacionesDB.set(updatedUbicaciones);
    this.ubicaciones.set(updatedUbicaciones);

    return of({
      success: true,
      message: 'Ubicación eliminada exitosamente'
    }).pipe(delay(300));
  }
}
