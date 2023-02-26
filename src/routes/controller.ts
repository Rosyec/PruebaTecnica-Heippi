import { Response, Request, Router } from "express";
import { Model } from "mongoose";
import {
  CambiarContrasena,
  Info,
  EmptyData,
  Hospital,
  Paciente,
  Usuarios,
  Medico,
} from "../interfaces/data";
import {
  hospitalModel,
  medicoModel,
  pacienteModel,
  usuarioModel,
} from "../models/users";

/**
 * * 1. REGISTRO DE USUARIOS (PACIENTE - HOSPITAL)
 */
const router: Router = Router();

router.post(
  "/usuarios",
  async ({ body }: Request<void, void, Usuarios>, resp: Response) => {
    const { identificacion, email, contrasena, telefono, tipo_usuario } = body;
    if (!(identificacion && email && contrasena && telefono && tipo_usuario))
      return resp.status(400).send("Error: Faltan campos.");
    try {
      const emailUsuario = await getEmail(email);
      if (emailUsuario.length >= 1) {
        return resp.send(`Ya existe un usuario con el email (${email})`);
      } else if ( tipo_usuario !== 1 && tipo_usuario !== 2 ) {
        return resp.send('Solo se permiten usuarios de tipo hospital (1) y paciente (2).');
      }
      const registrarMedico = new usuarioModel(body);
      const paciente = await registrarMedico.save();
      resp.status(201).json(paciente);
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 2. LOGIN DE USUARIOS (PACIENTE - HOSPITAL - MEDICO)
 */

router.get(
  "/usuarios",
  async ({ body }: Request<void, void, Usuarios>, resp: Response) => {
    const { identificacion, contrasena } = body;
    if (!(identificacion && contrasena))
      return resp.status(400).send("Error: faltan campos.");
    try {
      const data = await getUsuario(identificacion, usuarioModel);
      if (contrasena === data.contrasena) {
        if (data.contrasena === "123456" && data.tipo_usuario === 3) {
          return resp.status(200).send("Debes cambiar la contraseña");
        }
        return resp.status(200).send("Bienvenido.");
      }
      return resp
        .status(404)
        .send("La identificación o contraseña son erroneas.");
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 3. REGISTRO DE DATOS (HOSPITAL)
 */

router.post(
  "/usuarios/hospital",
  async ({ body }: Request<void, void, Hospital>, resp: Response) => {
    const { nombre, direccion, servicios, identificacion } = body;
    if (!(identificacion && nombre && direccion && servicios))
      return resp.status(400).send("Error: Faltan campos.");
    try {
      const data = await getUsuario(identificacion, usuarioModel);
      if (data.identificacion === identificacion && data.tipo_usuario === 1) {
        if ((await getUsuario(identificacion, hospitalModel)).identificacion)
          return resp.send("Ya estan registrados tus datos.");
        const registrarDatos = new hospitalModel(body);
        const datos = await registrarDatos.save();
        return resp.status(201).json(datos);
      }
      return resp
        .status(404)
        .send(
          "No existe un hospital con esa identificación, vuelve a intentarlo."
        );
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 3.1 REGISTRO DE DATOS (PACIENTE)
 */

router.post(
  "/usuarios/paciente/:id",
  async ({ body, params }: Request<any, void, Paciente>, resp: Response) => {
    const id = parseInt(params.id);
    const { nombre, direccion, fecha_nacimiento, identificacion } = body;
    if (!(identificacion && nombre && direccion && fecha_nacimiento && id))
      return resp.status(400).send("Error: Faltan campos.");
    try {
      if ((await getUsuario(id, usuarioModel)).identificacion !== id)
        return resp.send("No existe un hospital con esa identificación al cual registrar.");
      const data = await getUsuario(identificacion, usuarioModel);
      if (data.identificacion === identificacion && data.tipo_usuario === 2) {
        if ((await getUsuario(identificacion, pacienteModel)).identificacion)
          return resp.send("Ya estan registrados tus datos.");
        const registrarDatos = new pacienteModel({ ...body, id_hospital: id });
        const datos = await registrarDatos.save();
        return resp.status(201).json(datos);
      }
      return resp
        .status(404)
        .send(
          "No existe un paciente con esa identificación, vuelve a intentarlo."
        );
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 4. REGISTRO USUARIO MEDICO POR PARTE DE HOSPITAL
 */

router.post(
  "/usuarios/medico/:id",
  async ({ body, params }: Request<any, void, Medico>, resp: Response) => {
    const id = parseInt(params.id);
    const {
      identificacion,
      email,
      telefono,
      tipo_usuario,
      especialidad,
      nombre,
    } = body;
    if (
      !(
        identificacion &&
        email &&
        telefono &&
        tipo_usuario &&
        id &&
        especialidad &&
        nombre
      )
    )
      return resp.status(400).send("Error: Faltan campos.");
    try {
      if ((await getUsuario(id, usuarioModel)).identificacion !== id)
        return resp.send("No existe un hospital con esa identificación.");
      const validate = await getEmail(email);
      if (validate.length >= 1) {
        return resp.send(`Ya existe un usuario con el email (${email})`);
      } else if ( tipo_usuario !== 3 ) {
        return resp.send('Solo se permiten usuarios de tipo medico (3).');
      }
      const { usuario, medico } = setMedico(body, id);
      const tipoUsuario = await usuario.save();
      const tipoDatos = await medico.save();
      resp.status(201).json({ tipoUsuario, tipoDatos });
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 5. CAMBIAR CONTRASEÑA (PACIENTE - HOSPITAL - MEDICO)
 */

router.put(
  "/usuarios",
  async ({ body }: Request<void, void, CambiarContrasena>, resp: Response) => {
    const { identificacion, contrasena_actual, nueva_contrasena } = body;
    if (!(identificacion && contrasena_actual && nueva_contrasena))
      return resp.status(400).send("Error: faltan campos.");
    try {
      const data = await getUsuario(identificacion, usuarioModel);
      if (contrasena_actual === data.contrasena) {
        await usuarioModel.findOneAndUpdate(
          { identificacion },
          { contrasena: nueva_contrasena }
        );
        return resp.status(200).send("Contraseña cambiada.");
      }
      return resp
        .status(404)
        .send("La identificación o contraseña son erroneas.");
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * * 6. INFORMACIÓN POR HOSPITAL
 */

router.get(
  "/hospital/info",
  async ({ body }: Request<void, void, Info>, resp: Response) => {
    const { id_hospital } = body;
    if (!id_hospital) return resp.status(400).send("Error: faltan campos.");
    try {
      if (
        (await getUsuario(id_hospital, usuarioModel)).identificacion !==
        id_hospital
      )
        return resp.send("No existe un hospital con esa identificación.");
      return resp.status(200).json({ ...(await getDataHospital(id_hospital)) });
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * ! METODOS
 */

const getUsuario = async (id: number, db: Model<any>) => {
  return (
    (await db.findOne<Usuarios>({ $or: [{ identificacion: id }] })) || EmptyData
  );
};

const getEmail = async (email: string) => {
  return await usuarioModel.find<Usuarios>({
    $or: [{ email }],
  });
};

const getDataHospital = async (id_hospital: number) => {
  const pacientes = await pacienteModel.find({ id_hospital });
  const medicos = await medicoModel.find({ id_hospital });
  const hospital = await hospitalModel.find({ identificacion: id_hospital });
  return {
    pacientes,
    medicos,
    hospital,
  };
};

const setMedico = (data: Medico, id_hospital: number) => {
  const {
    email,
    especialidad,
    identificacion,
    nombre,
    telefono,
    tipo_usuario,
  } = data;
  const usuario = new usuarioModel({
    identificacion,
    email,
    contrasena: 123456,
    telefono,
    tipo_usuario,
  });
  const medico = new medicoModel({
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

export { router };
