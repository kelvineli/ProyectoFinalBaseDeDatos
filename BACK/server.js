import express from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a SQL Server
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Endpoint de login
app.post("/login", async (req, res) => {
  const { Usuario, Contraseña} = req.body;

      const ip = 
        req.headers["x-forwarded-for"]?.split(",")[0] || 
        req.socket.remoteAddress;

    console.log("IP del cliente:", ip);

  //console.log("Esto recibo:" + Usuario + ' - ' + Contraseña);

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("usuario", sql.NVarChar, Usuario)
      .input("contra", sql.NVarChar, Contraseña)
      .input("ip", sql.NVarChar, ip)
      .execute("validarLogin");

    if (result.recordset.length > 0 && result.recordset[0].idUsuario) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.json({ success: false, message: "Credenciales inválidas" });
    }

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/tickets", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("spTicket_ListarDetalle");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron tickets" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/categorias", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("sp_CategoriaTicket_Listar");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron categorias" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/urgencias", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("sp_UrgenciaTicket_Listar");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron urgencias" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/estados", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("sp_EstadoTicket_Listar");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron estados" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/tecnicos", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("sp_Usuario_ListarTecnicos");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron tecnicos" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("spUsuarios_Obtener");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron tecnicos" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/roles", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .execute("sp_Rol_Listar");  

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron tecnicos" });
    }

  } catch (err) {
    console.error("Error en la vista:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Obtener Ticket por ID
app.post("/obtenerTicket", async (req, res) => {
  const { idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("idTicket", sql.Int, idTicket);

    const result = await request.execute("spTicket_Obtener");

    const returnValue = result.returnValue;

    if (returnValue === 0 || (result.recordset && result.recordset.length > 0)) {
      res.json({ success: true, data: result.recordset[0] }); // devuelve solo el estudiante
    } else if (returnValue === 6) {
      res.json({ success: false, message: "Ticket no encontrado" });
    } else {
      res.json({ success: false, message: "Error desconocido" });
    }
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Obtener Ticket por ID
app.post("/obtenerUsuario", async (req, res) => {
  const { idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("idTicket", sql.Int, idTicket);

    const result = await request.execute("spUsuario_Obtener");

    const returnValue = result.returnValue;

    if (returnValue === 0 || (result.recordset && result.recordset.length > 0)) {
      res.json({ success: true, data: result.recordset[0] }); // devuelve solo el estudiante
    } else if (returnValue === 6) {
      res.json({ success: false, message: "Ticket no encontrado" });
    } else {
      res.json({ success: false, message: "Error desconocido" });
    }
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Obtener Nota Ticket por ID
app.post("/obtenerNotaTicket", async (req, res) => {
  const { idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("idTicket", sql.Int, idTicket);

    const result = await request.execute("sp_TicketNota_ListarPorTicket");

    const returnValue = result.returnValue;

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron notas" });
    }
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Obtener Nota Ticket por ID
app.post("/obtenerTicketTecnico", async (req, res) => {
  const { idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("idTicket", sql.Int, idTicket);

    const result = await request.execute("sp_Ticket_ListarDetallePorTecnico");

    const returnValue = result.returnValue;

    if (result.recordset.length > 0) {
      res.json({ success: true, data: result.recordset });
    } else {
      res.json({ success: false, message: "No se encontraron notas" });
    }
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/obtenerNotaIndividualTicket", async (req, res) => {
  const { idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("idTicket", sql.Int, idTicket);

    const result = await request.execute("spNota_Obtener");

    const returnValue = result.returnValue;

    if (returnValue === 0 || (result.recordset && result.recordset.length > 0)) {
      res.json({ success: true, data: result.recordset[0] }); // devuelve solo el estudiante
    } else if (returnValue === 6) {
      res.json({ success: false, message: "Ticket no encontrado" });
    } else {
      res.json({ success: false, message: "Error desconocido" });
    }
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Crear Ticket
app.post("/insertarTicket", async (req, res) => {
  const { titulo, descripcion, idCategoria, idUrgencia, idCreador, idEstadoTicket, idTecnico } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("Titulo", sql.VarChar(150), titulo);
    request.input("Descripcion", sql.VarChar(sql.MAX), descripcion);
    request.input("idCategoriaTicket", sql.Int, idCategoria);
    request.input("idUrgencia", sql.Int, idUrgencia);
    request.input("idCreador", sql.Int, idCreador);

    const result = await request.execute("spTicket_Crear");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Ticket insertado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Crear Ticket
app.post("/insertarUsuario", async (req, res) => {
  const { nombre, usuario, contrasena, idRol, idEstado } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("Nombre", sql.VarChar(150), nombre);
    request.input("Usuario", sql.VarChar(50), usuario);
    request.input("Contra", sql.VarChar(50), contrasena);
    request.input("idRol", sql.Int, idRol);
    request.input("idEstadoUsuario", sql.Int, idEstado);

    const result = await request.execute("crearUsuario");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Usuario insertado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/editarUsuario", async (req, res) => {
  const { nombre, usuario, contrasena, idRol, idEstado, idUsuario } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idUsuario", sql.Int, idUsuario);
    request.input("Nombre", sql.VarChar(150), nombre);
    request.input("Usuario", sql.VarChar(50), usuario);
    request.input("Contra", sql.VarChar(50), contrasena);
    request.input("idRol", sql.Int, idRol);
    request.input("idEstadoUsuario", sql.Int, idEstado);

    const result = await request.execute("editarUsuario");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Usuario insertado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Crear Ticket
app.post("/insertarNotaTicket", async (req, res) => {
  const { nota, idEstado, idCreador, idTicket } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idTicket", sql.Int, idTicket);
    request.input("idUsuario", sql.Int, idCreador);
    request.input("Nota", sql.VarChar(sql.MAX), nota);
    request.input("Activo", sql.Int, idEstado);


    const result = await request.execute("sp_TicketNota_Crear");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Nota insertada correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/actualizarNotaTicket", async (req, res) => {
  const { nota, idEstado, idNota } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idNota", sql.Int, idNota);
    request.input("Nota", sql.VarChar(sql.MAX), nota);
    request.input("Activo", sql.Int, idEstado);


    const result = await request.execute("sp_TicketNota_Actualizar");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Nota insertada correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});
// Actualizar Ticket
app.post("/actualizarTicket", async (req, res) => {
  const { idTicket, titulo, descripcion, idCategoria, idUrgencia, idCreador, idEstadoTicket, idTecnico } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idTicket", sql.Int, idTicket);
    request.input("Titulo", sql.VarChar(150), titulo);
    request.input("Descripcion", sql.VarChar(sql.MAX), descripcion);
    request.input("idCategoriaTicket", sql.Int, idCategoria);
    request.input("idUrgencia", sql.Int, idUrgencia);
    request.input("idEstadoTicket", sql.Int, idEstadoTicket);
    request.input("idTecnico", sql.Int, idTecnico);

    const result = await request.execute("spTicket_Actualizar");
    const returnValue = result.returnValue;

    if (returnValue === 0) {
      res.json({ success: true, message: "Ticket actualizado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }
  } catch (err) {
    console.error("Error en actualizarTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Crear Ticket
app.post("/actualizarEstadoTicket", async (req, res) => {
  const { idTicket, idEstadoTicket} = req.body;

  console.log("Recibido en servidor actualizarEstadoTicket:", idTicket, idEstadoTicket);

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idTicket", sql.Int, idTicket);
    request.input("idEstadoTicket", sql.Int, idEstadoTicket);

    const result = await request.execute("spTicket_CambiarEstado");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Ticket editado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en actualizarEstadoTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/actualizarTecnicoTicket", async (req, res) => {
  const { idTicket, idEstadoTicket} = req.body;

  console.log("Recibido en servidor actualizarTecnicoTicket:", idTicket, idEstadoTicket);

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("idTicket", sql.Int, idTicket);
    request.input("idTecnico", sql.Int, idEstadoTicket);

    const result = await request.execute("spTicket_AsignarTecnico");

    const returnValue = result.returnValue; // el RETURN del SP

    if (returnValue === 0) {
      res.json({ success: true, message: "Ticket editado correctamente" });
    } else {
      let mensaje = "";
      switch (returnValue) {
        default: mensaje = "Error desconocido";
      }
      res.json({ success: false, message: mensaje });
    }

  } catch (err) {
    console.error("Error en actualizarEstadoTicket:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});


// Levantar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
