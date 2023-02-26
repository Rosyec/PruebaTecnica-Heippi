import { Schema, model } from "mongoose";

const Usuario: Schema = new Schema({
  tipo_usuario: Number,
  identificacion: Number,
  email: String,
  contrasena: String,
  telefono: String,
});

const Hospital: Schema = new Schema({
  identificacion: Number,
  nombre: String,
  direccion: String,
  servicios: String,
});

const Paciente: Schema = new Schema({
  id_hospital: Number,
  identificacion: Number,
  nombre: String,
  direccion: String,
  fecha_nacimiento: String,
});

const Medico: Schema = new Schema({
  id_hospital: Number,
  identificacion: Number,
  nombre: String,
  especialidad: String,
});

const usuarioModel = model("usuario", Usuario);
const hospitalModel = model("hospital", Hospital);
const pacienteModel = model("paciente", Paciente);
const medicoModel = model("medico", Medico);

export { usuarioModel, hospitalModel, pacienteModel, medicoModel };
