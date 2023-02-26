"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicoModel = exports.pacienteModel = exports.hospitalModel = exports.usuarioModel = void 0;
const mongoose_1 = require("mongoose");
const Usuario = new mongoose_1.Schema({
    tipo_usuario: Number,
    identificacion: Number,
    email: String,
    contrasena: String,
    telefono: String,
});
const Hospital = new mongoose_1.Schema({
    identificacion: Number,
    nombre: String,
    direccion: String,
    servicios: String,
});
const Paciente = new mongoose_1.Schema({
    id_hospital: Number,
    identificacion: Number,
    nombre: String,
    direccion: String,
    fecha_nacimiento: String,
});
const Medico = new mongoose_1.Schema({
    id_hospital: Number,
    identificacion: Number,
    nombre: String,
    especialidad: String,
});
const usuarioModel = (0, mongoose_1.model)("usuario", Usuario);
exports.usuarioModel = usuarioModel;
const hospitalModel = (0, mongoose_1.model)("hospital", Hospital);
exports.hospitalModel = hospitalModel;
const pacienteModel = (0, mongoose_1.model)("paciente", Paciente);
exports.pacienteModel = pacienteModel;
const medicoModel = (0, mongoose_1.model)("medico", Medico);
exports.medicoModel = medicoModel;
