import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';

/**
 * HU #1: Factory function para crear validador asíncrono de unicidad de nombres
 * Recibe el servicio como parámetro para evitar problemas con inject()
 */
export function createUniqueCategoryNameValidator(
  categoryService: CategoryService, 
  excludeId?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Si el control está vacío, no validar (other validators handle required)
    if (!control.value || control.value.length === 0) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300), // Debounce para evitar validaciones excesivas
      switchMap(name => 
        categoryService.isNameUnique(name, excludeId).pipe(
          map(isUnique => {
            return isUnique ? null : { 
              nameExists: {
                message: 'El nombre de la categoría ya existe. Por favor, ingrese un nombre único.',
                value: name
              }
            };
          }),
          catchError(() => {
            // En caso de error de red, permitir el valor pero registrar el error
            console.warn('Error checking category name uniqueness');
            return of(null);
          })
        )
      )
    );
  };
}

/**
 * Validador síncrono para formato de nombre de categoría
 * HU #1: El nombre debe tener entre 3 y 50 caracteres
 */
export function categoryNameFormatValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const name = control.value.trim();
  
  // Validar longitud mínima
  if (name.length < 3) {
    return {
      categoryNameTooShort: {
        message: 'El nombre debe tener al menos 3 caracteres',
        actualLength: name.length,
        minLength: 3
      }
    };
  }

  // Validar longitud máxima
  if (name.length > 50) {
    return {
      categoryNameTooLong: {
        message: 'El nombre no puede exceder 50 caracteres',
        actualLength: name.length,
        maxLength: 50
      }
    };
  }

  // Validar que no sean solo espacios
  if (name.length === 0) {
    return {
      categoryNameOnlySpaces: {
        message: 'El nombre no puede contener solo espacios'
      }
    };
  }

  // Validar caracteres válidos (letras, números, espacios, algunos caracteres especiales)
  const validNamePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.()]+$/;
  if (!validNamePattern.test(name)) {
    return {
      categoryNameInvalidChars: {
        message: 'El nombre contiene caracteres no válidos. Solo se permiten letras, números, espacios y algunos símbolos (-, _, ., ())',
        value: name
      }
    };
  }

  return null;
}

/**
 * Validador síncrono para formato de descripción de categoría
 * HU #1: La descripción debe tener entre 10 y 90 caracteres
 */
export function categoryDescriptionValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const description = control.value.trim();
  
  // Validar longitud mínima
  if (description.length < 10) {
    return {
      categoryDescriptionTooShort: {
        message: 'La descripción debe tener al menos 10 caracteres',
        actualLength: description.length,
        minLength: 10
      }
    };
  }

  // Validar longitud máxima
  if (description.length > 90) {
    return {
      categoryDescriptionTooLong: {
        message: 'La descripción no puede exceder 90 caracteres',
        actualLength: description.length,
        maxLength: 90
      }
    };
  }

  // Validar que no sean solo espacios
  if (description.length === 0) {
    return {
      categoryDescriptionOnlySpaces: {
        message: 'La descripción no puede contener solo espacios'
      }
    };
  }

  return null;
}
