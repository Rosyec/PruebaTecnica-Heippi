"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const data_1 = require("../interfaces/data");
const users_1 = require("../models/users");
/**
 * * 1. REGISTRO DE USUARIOS (PACIENTE - HOSPITAL)
 */
const router = (0, express_1.Router)();
exports.router = router;
router.post("/usuarios", ({ body }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { identificacion, email, contrasena, telefono, tipo_usuario } = body;
    if (!(identificacion && email && contrasena && telefono && tipo_usuario))
        return resp.status(400).send("Error: Faltan campos.");
    try {
        const emailUsuario = yield getEmail(email);
        if (emailUsuario.length >= 1) {
            return resp.send(`Ya existe un usuario con el email (${email})`);
        }
        else if (tipo_usuario !== 1 && tipo_usuario !== 2) {
            return resp.send('Solo se permiten usuarios de tipo hospital (1) y paciente (2).');
        }
        const registrarMedico = new users_1.usuarioModel(body);
        const paciente = yield registrarMedico.save();
        resp.status(201).json(paciente);
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 2. LOGIN DE USUARIOS (PACIENTE - HOSPITAL - MEDICO)
 */
router.get("/usuarios", ({ body }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { identificacion, contrasena } = body;
    if (!(identificacion && contrasena))
        return resp.status(400).send("Error: faltan campos.");
    try {
        const data = yield getUsuario(identificacion, users_1.usuarioModel);
        if (contrasena === data.contrasena) {
            if (data.contrasena === "123456" && data.tipo_usuario === 3) {
                return resp.status(200).send("Debes cambiar la contraseña");
            }
            return resp.status(200).send("Bienvenido.");
        }
        return resp
            .status(404)
            .send("La identificación o contraseña son erroneas.");
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 3. REGISTRO DE DATOS (HOSPITAL)
 */
router.post("/usuarios/hospital", ({ body }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, direccion, servicios, identificacion } = body;
    if (!(identificacion && nombre && direccion && servicios))
        return resp.status(400).send("Error: Faltan campos.");
    try {
        const data = yield getUsuario(identificacion, users_1.usuarioModel);
        if (data.identificacion === identificacion && data.tipo_usuario === 1) {
            if ((yield getUsuario(identificacion, users_1.hospitalModel)).identificacion)
                return resp.send("Ya estan registrados tus datos.");
            const registrarDatos = new users_1.hospitalModel(body);
            const datos = yield registrarDatos.save();
            return resp.status(201).json(datos);
        }
        return resp
            .status(404)
            .send("No existe un hospital con esa identificación, vuelve a intentarlo.");
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 3.1 REGISTRO DE DATOS (PACIENTE)
 */
router.post("/usuarios/paciente/:id", ({ body, params }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(params.id);
    const { nombre, direccion, fecha_nacimiento, identificacion } = body;
    if (!(identificacion && nombre && direccion && fecha_nacimiento && id))
        return resp.status(400).send("Error: Faltan campos.");
    try {
        if ((yield getUsuario(id, users_1.usuarioModel)).identificacion !== id)
            return resp.send("No existe un hospital con esa identificación al cual registrar.");
        const data = yield getUsuario(identificacion, users_1.usuarioModel);
        if (data.identificacion === identificacion && data.tipo_usuario === 2) {
            if ((yield getUsuario(identificacion, users_1.pacienteModel)).identificacion)
                return resp.send("Ya estan registrados tus datos.");
            const registrarDatos = new users_1.pacienteModel(Object.assign(Object.assign({}, body), { id_hospital: id }));
            const datos = yield registrarDatos.save();
            return resp.status(201).json(datos);
        }
        return resp
            .status(404)
            .send("No existe un paciente con esa identificación, vuelve a intentarlo.");
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 4. REGISTRO USUARIO MEDICO POR PARTE DE HOSPITAL
 */
router.post("/usuarios/medico/:id", ({ body, params }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(params.id);
    const { identificacion, email, telefono, tipo_usuario, especialidad, nombre, } = body;
    if (!(identificacion &&
        email &&
        telefono &&
        tipo_usuario &&
        id &&
        especialidad &&
        nombre))
        return resp.status(400).send("Error: Faltan campos.");
    try {
        if ((yield getUsuario(id, users_1.usuarioModel)).identificacion !== id)
            return resp.send("No existe un hospital con esa identificación.");
        const validate = yield getEmail(email);
        if (validate.length >= 1) {
            return resp.send(`Ya existe un usuario con el email (${email})`);
        }
        else if (tipo_usuario !== 3) {
            return resp.send('Solo se permiten usuarios de tipo medico (3).');
        }
        const { usuario, medico } = setMedico(body, id);
        const tipoUsuario = yield usuario.save();
        const tipoDatos = yield medico.save();
        resp.status(201).json({ tipoUsuario, tipoDatos });
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 5. CAMBIAR CONTRASEÑA (PACIENTE - HOSPITAL - MEDICO)
 */
router.put("/usuarios", ({ body }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { identificacion, contrasena_actual, nueva_contrasena } = body;
    if (!(identificacion && contrasena_actual && nueva_contrasena))
        return resp.status(400).send("Error: faltan campos.");
    try {
        const data = yield getUsuario(identificacion, users_1.usuarioModel);
        if (contrasena_actual === data.contrasena) {
            yield users_1.usuarioModel.findOneAndUpdate({ identificacion }, { contrasena: nueva_contrasena });
            return resp.status(200).send("Contraseña cambiada.");
        }
        return resp
            .status(404)
            .send("La identificación o contraseña son erroneas.");
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * * 6. INFORMACIÓN POR HOSPITAL
 */
router.get("/hospital/info", ({ body }, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_hospital } = body;
    if (!id_hospital)
        return resp.status(400).send("Error: faltan campos.");
    try {
        if ((yield getUsuario(id_hospital, users_1.usuarioModel)).identificacion !==
            id_hospital)
            return resp.send("No existe un hospital con esa identificación.");
        return resp.status(200).json(Object.assign({}, (yield getDataHospital(id_hospital))));
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * ! METODOS
 */
const getUsuario = (id, db) => __awaiter(void 0, void 0, void 0, function* () {
    return ((yield db.findOne({ $or: [{ identificacion: id }] })) || data_1.EmptyData);
});
const getEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield users_1.usuarioModel.find({
        $or: [{ email }],
    });
});
const getDataHospital = (id_hospital) => __awaiter(void 0, void 0, void 0, function* () {
    const pacientes = yield users_1.pacienteModel.find({ id_hospital });
    const medicos = yield users_1.medicoModel.find({ id_hospital });
    const hospital = yield users_1.hospitalModel.find({ identificacion: id_hospital });
    return {
        pacientes,
        medicos,
        hospital,
    };
});
const setMedico = (data, id_hospital) => {
    const { email, especialidad, identificacion, nombre, telefono, tipo_usuario, } = data;
    const usuario = new users_1.usuarioModel({
        identificacion,
        email,
        contrasena: 123456,
        telefono,
        tipo_usuario,
    });
    const medico = new users_1.medicoModel({
        id_hospital,
        identificacion,
        nombre,
        especialidad,
    });
    return {
        usuario,
        medico,
    };
};
