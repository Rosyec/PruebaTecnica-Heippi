## Prueba Técnica - Perfil Backend

> NodeJS - Typescript - Mongo - Express

#DESCRIPCIÓN:

Este proyecto se realizó en NodeJS con la base de datos de Mongo, utilizando el cluster de Mongo Atlas y todo ello con Typescript, realizando la transpilación a Javascript y subido a Vercel para que puedan realizar las respectivas pruebas.

Nota: Los parametros deben ser enviados en el body.

#1. REGISTRO DE USUARIOS (PACIENTE - HOSPITAL)

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios/ - >POST
````
**Parámetros Obligatorios:**
```
identificacion, email, contrasena, telefono, tipo_usuario.
```

#2. LOGIN DE USUARIOS (PACIENTE - HOSPITAL - MEDICO)

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios/ - >GET
````
**Parámetros Obligatorios:**
```
identificacion, contrasena.
```

#3. REGISTRO DE DATOS (HOSPITAL)

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios/hospital - >POST
````
**Parámetros Obligatorios:**
```
identificacion, nombre, direccion, servicios.
```

#3.1 REGISTRO DE DATOS (PACIENTE)

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios/paciente/:id - >POST
````
**Observación:** El path param (:id) debe ser una identificación de un hospital ya registrado.
**Parámetros Obligatorios:**
```
identificacion, nombre, direccion, fecha_nacimiento, id.
```

#4. REGISTRO USUARIO MEDICO POR PARTE DE HOSPITAL

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios/medico/:id - >POST
````
**Observación:** El path param (:id) debe ser una identificación de un hospital ya registrado.
**Parámetros Obligatorios:**
```
identificacion, email, telefono, tipo_usuario, id, especialidad, nombre.
```

#5. CAMBIAR CONTRASEÑA (PACIENTE - HOSPITAL - MEDICO)

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/usuarios - >PUT
````
**Parámetros Obligatorios:**
```
identificacion, contrasena_actual, nueva_contrasena.
```

#6. INFORMACIÓN POR HOSPITAL

**Endpoint:** 
```
https://prueba-tecnica-backend.vercel.app/hospital/info - >GET
````
**Parámetros Obligatorios:**
```
id_hospital.
```

Link al backend desplegado en Vercel: [App](https://prueba-tecnica-backend.vercel.app/)

Realizado por: #Ceysor Parrado Leguizamon.
