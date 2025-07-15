import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly storageKeys = {
    categories: 'hogar360_categories',
    ubicaciones: 'hogar360_ubicaciones',
    properties: 'hogar360_properties',
    usuarios: 'hogar360_usuarios',
    visitSchedules: 'hogar360_visit_schedules',
    visits: 'hogar360_visits'
  };

  // Subjects para notificar cambios
  private readonly categoriesSubject = new BehaviorSubject<any[]>(this.getCategories());
  private readonly ubicacionesSubject = new BehaviorSubject<any[]>(this.getUbicaciones());
  private readonly propertiesSubject = new BehaviorSubject<any[]>(this.getProperties());
  private readonly usuariosSubject = new BehaviorSubject<any[]>(this.getUsuarios());
  private readonly visitSchedulesSubject = new BehaviorSubject<any[]>(this.getVisitSchedules());
  private readonly visitsSubject = new BehaviorSubject<any[]>(this.getVisits());

  constructor() {
    this.initializeDefaultData();
  }

  // Observables para que los componentes se suscriban
  categories$ = this.categoriesSubject.asObservable();
  ubicaciones$ = this.ubicacionesSubject.asObservable();
  properties$ = this.propertiesSubject.asObservable();
  usuarios$ = this.usuariosSubject.asObservable();
  visitSchedules$ = this.visitSchedulesSubject.asObservable();
  visits$ = this.visitsSubject.asObservable();

  // Métodos para categorías
  getCategories(): any[] {
    return this.getFromStorage(this.storageKeys.categories) || [];
  }

  saveCategories(categories: any[]): void {
    this.saveToStorage(this.storageKeys.categories, categories);
    this.categoriesSubject.next(categories);
  }

  addCategory(category: any): any {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: Date.now(),
      fechaCreacion: new Date().toISOString(),
      activo: true
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  updateCategory(id: number, category: any): any {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCategory = {
        ...categories[index],
        ...category,
        id: categories[index].id, // Mantener el ID original
        fechaActualizacion: new Date()
      };
      categories[index] = updatedCategory;
      this.saveCategories(categories);
      return updatedCategory;
    }
    throw new Error('Categoría no encontrada');
  }

  deleteCategory(id: number): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        activo: false
      };
      this.saveCategories(categories);
    }
  }

  /**
   * Obtener categoría por ID
   */
  getCategoryById(id: number): any {
    const categories = this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  // Métodos para ubicaciones
  getUbicaciones(): any[] {
    return this.getFromStorage(this.storageKeys.ubicaciones) || [];
  }

  saveUbicaciones(ubicaciones: any[]): void {
    this.saveToStorage(this.storageKeys.ubicaciones, ubicaciones);
    this.ubicacionesSubject.next(ubicaciones);
  }

  addUbicacion(ubicacion: any): any {
    const ubicaciones = this.getUbicaciones();
    const newUbicacion = {
      ...ubicacion,
      id: Date.now(),
      fechaCreacion: new Date(),
      activo: true
    };
    ubicaciones.push(newUbicacion);
    this.saveUbicaciones(ubicaciones);
    return newUbicacion;
  }

  updateUbicacion(id: number, ubicacion: any): any {
    const ubicaciones = this.getUbicaciones();
    const index = ubicaciones.findIndex(u => u.id === id);
    if (index !== -1) {
      const updatedUbicacion = {
        ...ubicaciones[index],
        ...ubicacion,
        id: ubicaciones[index].id, // Mantener el ID original
        fechaActualizacion: new Date()
      };
      ubicaciones[index] = updatedUbicacion;
      this.saveUbicaciones(ubicaciones);
      return updatedUbicacion;
    }
    throw new Error('Ubicación no encontrada');
  }

  deleteUbicacion(id: number): void {
    const ubicaciones = this.getUbicaciones();
    const index = ubicaciones.findIndex(u => u.id === id);
    if (index !== -1) {
      ubicaciones[index] = {
        ...ubicaciones[index],
        activo: false
      };
      this.saveUbicaciones(ubicaciones);
    }
  }

  /**
   * Obtener ubicación por ID
   */
  getUbicacionById(id: number): any {
    const ubicaciones = this.getUbicaciones();
    return ubicaciones.find(ubicacion => ubicacion.id === id) || null;
  }

  // Métodos para propiedades
  getProperties(): any[] {
    return this.getFromStorage(this.storageKeys.properties) || [];
  }

  getPropertyById(id: number): any {
    const properties = this.getProperties();
    return properties.find(p => p.id === id);
  }

  saveProperties(properties: any[]): void {
    this.saveToStorage(this.storageKeys.properties, properties);
    this.propertiesSubject.next(properties);
  }

  addProperty(propertyRequest: any): any {
    const properties = this.getProperties();
    const categories = this.getCategories();
    const ubicaciones = this.getUbicaciones();
    
    // Buscar la categoría completa
    const categoria = categories.find(c => Number(c.id) === Number(propertyRequest.categoria_id));
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    // Buscar la ubicación completa
    const ubicacion = ubicaciones.find(u => Number(u.id) === Number(propertyRequest.ubicacion_id));
    if (!ubicacion) {
      throw new Error('Ubicación no encontrada');
    }
    
    // Crear la propiedad completa con objetos anidados
    const newProperty = {
      id: Date.now(), // Generar ID único
      nombre: propertyRequest.nombre,
      descripcion: propertyRequest.descripcion,
      categoria: {
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activo: categoria.activo,
        fechaCreacion: categoria.fechaCreacion
      },
      cantidad_cuartos: propertyRequest.cantidad_cuartos,
      cantidad_banos: propertyRequest.cantidad_banos,
      precio: propertyRequest.precio,
      ubicacion: {
        id: ubicacion.id,
        ciudad: ubicacion.ciudad,
        departamento: ubicacion.departamento,
        descripcionCiudad: ubicacion.descripcionCiudad,
        descripcionDepartamento: ubicacion.descripcionDepartamento,
        fechaCreacion: ubicacion.fechaCreacion,
        activo: ubicacion.activo
      },
      fecha_publicacion_activa: new Date(propertyRequest.fecha_publicacion_activa),
      estado_publicacion: propertyRequest.estado_publicacion,
      fecha_publicacion: new Date(),
      vendedor: { id: 1, nombre: 'Usuario Actual' }, // Se obtiene del contexto real de autenticación
      created_at: new Date(),
      updated_at: new Date(),
      fechaCreacion: new Date(),
      activo: true
    };
    
    properties.push(newProperty);
    this.saveProperties(properties);
    this.propertiesSubject.next(properties);
    return newProperty;
  }

  updateProperty(id: number, property: any): any {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProperty = {
        ...properties[index],
        ...property,
        id: properties[index].id, // Mantener el ID original
        fechaActualizacion: new Date()
      };
      properties[index] = updatedProperty;
      this.saveProperties(properties);
      return updatedProperty;
    }
    throw new Error('Propiedad no encontrada');
  }

  deleteProperty(id: number): void {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    this.saveProperties(filtered);
  }

  // Métodos para usuarios
  getUsuarios(): any[] {
    return this.getFromStorage(this.storageKeys.usuarios) || [];
  }

  saveUsuarios(usuarios: any[]): void {
    this.saveToStorage(this.storageKeys.usuarios, usuarios);
    this.usuariosSubject.next(usuarios);
  }

  addUsuario(usuario: any): void {
    const usuarios = this.getUsuarios();
    usuarios.push(usuario);
    this.saveUsuarios(usuarios);
  }

  updateUsuario(updatedUsuario: any): void {
    const usuarios = this.getUsuarios();
    const index = usuarios.findIndex(u => u.id === updatedUsuario.id);
    if (index !== -1) {
      usuarios[index] = updatedUsuario;
      this.saveUsuarios(usuarios);
    }
  }

  deleteUsuario(id: number): void {
    const usuarios = this.getUsuarios();
    const filtered = usuarios.filter(u => u.id !== id);
    this.saveUsuarios(filtered);
  }

  // Métodos para horarios de visita
  getVisitSchedules(): any[] {
    return this.getFromStorage(this.storageKeys.visitSchedules) || [];
  }

  saveVisitSchedules(schedules: any[]): void {
    this.saveToStorage(this.storageKeys.visitSchedules, schedules);
    this.visitSchedulesSubject.next(schedules);
  }

  addVisitSchedule(schedule: any): any {
    const schedules = this.getVisitSchedules();
    const properties = this.getProperties();
    // Buscar la propiedad completa
    const casaObj = properties.find(p => Number(p.id) === Number(schedule.casaId));
    if (!casaObj) {
      throw new Error('Propiedad no encontrada para crear horario');
    }
    const newSchedule = {
      id: Date.now(),
      vendedorId: schedule.vendedorId,
      casaId: schedule.casaId,
      fechaHoraInicio: schedule.fechaHoraInicio,
      fechaHoraFin: schedule.fechaHoraFin,
      espaciosDisponibles: schedule.espaciosDisponibles ?? 1,
      vendedor: { id: schedule.vendedorId, nombre: 'Usuario Actual' }, // placeholder
      casa: casaObj,
      visitasAgendadas: [] as any[],
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    schedules.push(newSchedule);
    this.saveVisitSchedules(schedules);
    return newSchedule;
  }

  updateVisitSchedule(id: number, schedule: any): any {
    const schedules = this.getVisitSchedules();
    const index = schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSchedule = {
        ...schedules[index],
        ...schedule,
        id: schedules[index].id, // Mantener el ID original
        fechaActualizacion: new Date()
      };
      schedules[index] = updatedSchedule;
      this.saveVisitSchedules(schedules);
      return updatedSchedule;
    }
    throw new Error('Horario no encontrado');
  }

  deleteVisitSchedule(id: number): void {
    const schedules = this.getVisitSchedules();
    const filtered = schedules.filter(s => s.id !== id);
    this.saveVisitSchedules(filtered);
  }

  // Métodos para visitas
  getVisits(): any[] {
    return this.getFromStorage(this.storageKeys.visits) || [];
  }

  saveVisits(visits: any[]): void {
    this.saveToStorage(this.storageKeys.visits, visits);
    this.visitsSubject.next(visits);
  }

  addVisit(visit: any): any {
    const visits = this.getVisits();
    const newVisit = {
      ...visit,
      id: Date.now(),
      fechaCreacion: new Date(),
      status: 'agendada'
    };
    visits.push(newVisit);
    this.saveVisits(visits);
    return newVisit;
  }

  updateVisit(id: number, visit: any): any {
    const visits = this.getVisits();
    const index = visits.findIndex(v => v.id === id);
    if (index !== -1) {
      const updatedVisit = {
        ...visits[index],
        ...visit,
        id: visits[index].id, // Mantener el ID original
        fechaActualizacion: new Date()
      };
      visits[index] = updatedVisit;
      this.saveVisits(visits);
      return updatedVisit;
    }
    throw new Error('Visita no encontrada');
  }

  deleteVisit(id: number): void {
    const visits = this.getVisits();
    const filtered = visits.filter(v => v.id !== id);
    this.saveVisits(filtered);
  }

  // Métodos auxiliares
  private getFromStorage(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return [];
    }
  }

  private saveToStorage(key: string, data: any[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  }

  // Inicializar datos por defecto
  private initializeDefaultData(): void {
    // Inicializar categorías si no existen
    if (this.getCategories().length === 0) {
      const defaultCategories = [
        { 
          id: 1, 
          nombre: 'Casa', 
          descripcion: 'Casas residenciales familiares',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        { 
          id: 2, 
          nombre: 'Apartamento', 
          descripcion: 'Apartamentos urbanos modernos',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        { 
          id: 3, 
          nombre: 'Casa de lujo', 
          descripcion: 'Propiedades premium de alto valor',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        { 
          id: 4, 
          nombre: 'Finca', 
          descripcion: 'Propiedades rurales y fincas',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];
      this.saveCategories(defaultCategories);
    }

    // Inicializar ubicaciones si no existen
    if (this.getUbicaciones().length === 0) {
      const defaultUbicaciones = [
        { 
          id: '1', 
          ciudad: 'Medellín', 
          departamento: 'Antioquia',
          descripcion_ciudad: 'Ciudad de la eterna primavera',
          descripcion_departamento: 'Departamento industrial y comercial'
        },
        { 
          id: '2', 
          ciudad: 'Bogotá', 
          departamento: 'Cundinamarca',
          descripcion_ciudad: 'Capital de Colombia',
          descripcion_departamento: 'Departamento central administrativo'
        },
        { 
          id: '3', 
          ciudad: 'Cali', 
          departamento: 'Valle del Cauca',
          descripcion_ciudad: 'Capital del Valle del Cauca',
          descripcion_departamento: 'Departamento del suroccidente'
        },
        { 
          id: '4', 
          ciudad: 'Cartagena', 
          departamento: 'Bolívar',
          descripcion_ciudad: 'Ciudad histórica y turística',
          descripcion_departamento: 'Departamento caribeño'
        }
      ];
      this.saveUbicaciones(defaultUbicaciones);
    }

    // Inicializar usuarios si no existen
    if (this.getUsuarios().length === 0) {
      const defaultUsuarios = [
        {
          id: 1,
          nombre: 'Juan Carlos',
          apellido: 'Vendedor',
          documento: '12345678',
          celular: '+573001234567',
          fechaNacimiento: '1985-05-15',
          correo: 'juan.vendedor@hogar360.com',
          rol: 'VENDEDOR',
          activo: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'María Isabel',
          apellido: 'Compradora',
          documento: '87654321',
          celular: '+573007654321',
          fechaNacimiento: '1990-08-22',
          correo: 'maria.compradora@hogar360.com',
          rol: 'COMPRADOR',
          activo: true,
          created_at: new Date().toISOString()
        }
      ];
      this.saveUsuarios(defaultUsuarios);
    }

    // Inicializar propiedades si no existen
    if (this.getProperties().length === 0) {
      const defaultProperties = [
        {
          id: 1,
          nombre: 'Casa Laureles',
          descripcion: 'Hermosa casa en el barrio Laureles con acabados de primera',
          categoria: { id: 1, nombre: 'Casa', descripcion: 'Casas residenciales familiares' },
          cantidad_cuartos: 3,
          cantidad_banos: 2,
          precio: 450000000,
          ubicacion: { 
            id: 1, 
            ciudad: 'Medellín', 
            departamento: 'Antioquia',
            descripcion_ciudad: 'Ciudad de la eterna primavera',
            descripcion_departamento: 'Departamento industrial y comercial'
          },
          fecha_publicacion_activa: new Date().toISOString(),
          estado_publicacion: 'PUBLICADA',
          fecha_publicacion: new Date().toISOString(),
          vendedor: { id: 1, nombre: 'Juan Carlos Vendedor' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Apartamento Zona Rosa',
          descripcion: 'Moderno apartamento en el corazón de Bogotá',
          categoria: { id: 2, nombre: 'Apartamento', descripcion: 'Apartamentos urbanos modernos' },
          cantidad_cuartos: 2,
          cantidad_banos: 1,
          precio: 320000000,
          ubicacion: { 
            id: 2, 
            ciudad: 'Bogotá', 
            departamento: 'Cundinamarca',
            descripcion_ciudad: 'Capital de Colombia',
            descripcion_departamento: 'Departamento central administrativo'
          },
          fecha_publicacion_activa: new Date().toISOString(),
          estado_publicacion: 'PUBLICADA',
          fecha_publicacion: new Date().toISOString(),
          vendedor: { id: 1, nombre: 'Juan Carlos Vendedor' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      this.saveProperties(defaultProperties);
    }
  }

  // Método para limpiar todos los datos (útil para desarrollo)
  clearAllData(): void {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDefaultData();
  }
}
