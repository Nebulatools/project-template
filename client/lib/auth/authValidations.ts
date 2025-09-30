import { LoginData, RegisterData, PasswordResetData, PasswordUpdateData, ProfileData } from '../../types/auth/auth'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s]?[(]?[\d]{1,3}[)]?[-\s\.]?[\d]{3,4}[-\s\.]?[\d]{4,6}$/

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: 'email', message: 'El correo electrónico es requerido' }
  }
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'El correo electrónico no es válido' }
  }
  return null
}

export function validatePassword(password: string, fieldName = 'password'): ValidationError | null {
  if (!password) {
    return { field: fieldName, message: 'La contraseña es requerida' }
  }
  if (password.length < 6) {
    return { field: fieldName, message: 'La contraseña debe tener al menos 6 caracteres' }
  }
  if (password.length > 128) {
    return { field: fieldName, message: 'La contraseña no puede tener más de 128 caracteres' }
  }
  return null
}

export function validateName(name: string): ValidationError | null {
  if (!name) {
    return { field: 'name', message: 'El nombre es requerido' }
  }
  if (name.length < 2) {
    return { field: 'name', message: 'El nombre debe tener al menos 2 caracteres' }
  }
  if (name.length > 100) {
    return { field: 'name', message: 'El nombre no puede tener más de 100 caracteres' }
  }
  return null
}

export function validatePhone(phone: string): ValidationError | null {
  if (phone && !phoneRegex.test(phone)) {
    return { field: 'phone', message: 'El número de teléfono no es válido' }
  }
  return null
}

export function validateLoginData(data: LoginData): ValidationResult {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)
  
  const passwordError = validatePassword(data.password)
  if (passwordError) errors.push(passwordError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateRegisterData(data: RegisterData): ValidationResult {
  const errors: ValidationError[] = []
  
  const nameError = validateName(data.name)
  if (nameError) errors.push(nameError)
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)
  
  const passwordError = validatePassword(data.password)
  if (passwordError) errors.push(passwordError)
  
  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Las contraseñas no coinciden' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePasswordResetData(data: PasswordResetData): ValidationResult {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePasswordUpdateData(data: PasswordUpdateData): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!data.token && !data.currentPassword) {
    errors.push({ field: 'currentPassword', message: 'La contraseña actual es requerida' })
  }
  
  const newPasswordError = validatePassword(data.newPassword, 'newPassword')
  if (newPasswordError) errors.push(newPasswordError)
  
  if (data.newPassword !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Las contraseñas no coinciden' })
  }
  
  if (data.currentPassword && data.currentPassword === data.newPassword) {
    errors.push({ field: 'newPassword', message: 'La nueva contraseña debe ser diferente a la actual' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateProfileData(data: ProfileData): ValidationResult {
  const errors: ValidationError[] = []
  
  const nameError = validateName(data.name)
  if (nameError) errors.push(nameError)
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)
  
  const phoneError = validatePhone(data.phone)
  if (phoneError) errors.push(phoneError)
  
  if (data.bio && data.bio.length > 500) {
    errors.push({ field: 'bio', message: 'La biografía no puede tener más de 500 caracteres' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}


 
