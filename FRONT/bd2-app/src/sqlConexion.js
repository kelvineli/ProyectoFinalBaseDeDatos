// sqlConexion.js

export async function login(usuario, pass) {
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Usuario: usuario, // 👈 CAMBIO: debe coincidir con el backend
        Contraseña: pass
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en login:", err);
    return { success: false, error: "Error en cliente" };
  }
}

export async function tickets() {
  try {
    const response = await fetch("http://localhost:4000/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en tickets:", err);
    return { success: false, error: "Error en cliente tickets" };
  }
}

export async function categorias() {
  try {
    const response = await fetch("http://localhost:4000/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en categorias:", err);
    return { success: false, error: "Error en cliente categorias" };
  }
}

export async function urgencias() {
  try {
    const response = await fetch("http://localhost:4000/urgencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en urgencias:", err);
    return { success: false, error: "Error en cliente urgencias" };
  }
}

export async function estados() {
  try {
    const response = await fetch("http://localhost:4000/estados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en estados:", err);
    return { success: false, error: "Error en cliente estados" };
  }
}

export async function tecnicos() {
  try {
    const response = await fetch("http://localhost:4000/tecnicos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en tecnicos:", err);
    return { success: false, error: "Error en cliente tecnicos" };
  }
}

export async function usuarios() {
  try {
    const response = await fetch("http://localhost:4000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en tecnicos:", err);
    return { success: false, error: "Error en cliente tecnicos" };
  }
}

export async function roles() {
  try {
    const response = await fetch("http://localhost:4000/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en tecnicos:", err);
    return { success: false, error: "Error en cliente tecnicos" };
  }
}



export async function eliminarEstudiante(idEstudiante) {
  try {
    const response = await fetch("http://localhost:4000/eliminarEstudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idEstudiante }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en eliminarEstudiante:", err);
    return { success: false, error: "Error en cliente eliminarEstudiante" };
  }
}

export async function obtenerTicket(idTicket) {
  try {
    const response = await fetch("http://localhost:4000/obtenerTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTicket }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    return { success: false, error: "Error en cliente obtenerTicket" };
  }
}

export async function obtenerUsuario(idTicket) {
  try {
    const response = await fetch("http://localhost:4000/obtenerUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTicket }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    return { success: false, error: "Error en cliente obtenerTicket" };
  }
}

export async function obtenerTicketTecnico(idTicket) {
  try {
    const response = await fetch("http://localhost:4000/obtenerTicketTecnico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTicket }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    return { success: false, error: "Error en cliente obtenerTicket" };
  }
}

export async function obtenerNotaTicket(idTicket) {
  try {
    const response = await fetch("http://localhost:4000/obtenerNotaTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTicket }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    return { success: false, error: "Error en cliente obtenerTicket" };
  }
}

export async function obtenerNotaIndividualTicket(idTicket) {
  try {
    const response = await fetch("http://localhost:4000/obtenerNotaIndividualTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTicket }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerTicket:", err);
    return { success: false, error: "Error en cliente obtenerTicket" };
  }
}

export async function insertarTicket(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarTicket:", err);
    return { success: false, error: "Error en cliente insertarTicket" };
  }
}

export async function insertarUsuario(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarTicket:", err);
    return { success: false, error: "Error en cliente insertarTicket" };
  }
}

export async function editarUsuario(formData) {
  try {
    const response = await fetch("http://localhost:4000/editarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarTicket:", err);
    return { success: false, error: "Error en cliente insertarTicket" };
  }
}

export async function insertarNotaTicket(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarNotaTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarTicket:", err);
    return { success: false, error: "Error en cliente insertarTicket" };
  }
}

export async function actualizarTicket(ticket) {
  try {
    const response = await fetch("http://localhost:4000/actualizarTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarEstudiante:", err);
    return { success: false, error: "Error en cliente actualizarEstudiante" };
  }
}

export async function actualizarNotaTicket(ticket) {
  try {
    const response = await fetch("http://localhost:4000/actualizarNotaTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarEstudiante:", err);
    return { success: false, error: "Error en cliente actualizarEstudiante" };
  }
}
export async function actualizarEstadoTicket(ticket) {
  try {
    const response = await fetch("http://localhost:4000/actualizarEstadoTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarEstadoTicket:", err);
    return { success: false, error: "Error en cliente actualizarEstadoTicket" };
  }
}

export async function actualizarTecnicoTicket(ticket) {
  try {
    const response = await fetch("http://localhost:4000/actualizarTecnicoTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarTecnicoTicket:", err);
    return { success: false, error: "Error en cliente actualizarTecnicoTicket" };
  }
}
