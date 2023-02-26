export const EmptyData: Usuarios = {
  identificacion: 0,
  email: "",
  contrasena: "",
  telefono: 0,
  tipo_usuario: 0,
};
export interface Usuarios {
  identificacion: number;
  email: string;
  contrasena: string;
  telefono: number;
  tipo_usuario: number;
}

export interface Hospital {
  identificacion: number;
  nombre: string;
  direccion: string;
  servicios: string;
}

export interface Paciente {
  identificacion: number;
  nombre: string;
  direccion: string;
  fecha_nacimiento: string;
}

export interface ID {
  id: number;
}

export interface CambiarContrasena {
  identificacion: number;
  contrasena_actual: string;
  nueva_contrasena: string;
}

export interface Info {
  id_hospital: number;
}

export interface Medico {
  nombre: string;
  especialidad: string;
  identificacion: number;
  email: string;
  telefono: number;
  tipo_usuario: number;
}
