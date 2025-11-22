import { useState, useEffect } from 'react';
import { usuarios, roles, insertarUsuario, obtenerUsuario, editarUsuario } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [ticketSeleccionado, setTicketSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contrasena: '',
    idRol: '',
    idEstado: ''
  });

  const [ticketsList, setTicketsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [urgenciasList, setUrgenciasList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

      const [estadosList, setEstadosList] = useState([
    { value: 1, label: "Activo" },
    { value: 2, label: "Inactivo" }
  ]);


  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setTicketSeleccionado('');

        setFormData({
    nombre: '',
    usuario: '',
    contrasena: '',
    idRol: '',
    idEstado: ''
        });

        setErrores({ ...errores, general: "", correo: ""});

        const cargarDatosTicket = async () => {
            const result = await usuarios();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const ticketsListados = (result.data || []).map((p) => ({
                    value: p.idUsuario,
                    label: `${p.Nombre} - ${p.Usuario}`,
                }));
                setTicketsList(ticketsListados);
            }
        };

        const cargarDatosCategoria = async () => {
            const result = await roles();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const categoriasListados = (result.data || []).map((p) => ({
                    value: p.idRol,
                    label: `${p.Rol}`,
                }));
                setRolesList(categoriasListados);
            }
        };

      cargarDatosTicket();
      cargarDatosCategoria();
    }
  }, [visible]);

  // Cuando se selecciona un ticket cargar sus datos
  useEffect(() => {
    const obtenerDatosTicket = async () => {
      if (!ticketSeleccionado) {
        setFormData({
    nombre: '',
    usuario: '',
    contrasena: '',
    idRol: '',
    idEstado: ''
        });
        return;
      }

      const result = await obtenerUsuario(ticketSeleccionado);

      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar ticket" });
      } else {
        setFormData({
    nombre: result.data.Nombre ,
    usuario: result.data.Usuario ,
    contrasena: '',
    idRol: result.data.idRol ,
    idEstado: result.data.idEstadoUsuario ,
        });
        setErrores({ general: "" , correo: ""});
      }
    };

    obtenerDatosTicket();
  }, [ticketSeleccionado]);

  const handleGuardar = async (crear = true) => {
    if(crear){
      const result = await insertarUsuario(formData);

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Usuario guardado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }else{
      const result = await editarUsuario({ idUsuario: ticketSeleccionado, ...formData });

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Usuario editado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">CREAR / EDITAR USUARIO</h2>

        {/* Selección de Tickets */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione un Usuario existente (opcional):</label>
          <Select
            options={ticketsList}
            value={ticketsList.find(op => op.value === ticketSeleccionado) || null}
            onChange={(opcion) => setTicketSeleccionado(opcion ? opcion.value : '')}
            placeholder="--- Nuevo Usuario ---"
            isClearable
            className="text-black"
            styles={{
              control: (provided, state) => ({
                ...provided,
                borderRadius: '1rem',
                paddingBottom: '2px',
                paddingTop: '2px',
                paddingLeft: '3px',
                paddingRight: '3px',
                backgroundColor: 'white',
                border: `2px solid ${state.isFocused ? '#ff9f47' : '#58585a'}`, // 🟠 Cambia color cuando está enfocado
                boxShadow: 'none', // elimina glow azul
                '&:hover': {
                  borderColor: '#ff9f47' // 🟡 color al pasar el mouse
                }
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#000' // texto negro
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#444' // color placeholder
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: '1rem'
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#ff9f47' : '#fff',
                color: state.isFocused ? '#000' : '#000',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              })
            }}
          />
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Título */}
          <div>
            <label className="block uppercase text-sm mb-1">Nombre:</label>
            <input
              type="text"
              maxLength={150}
              value={formData.nombre}
              onChange={(e) => {
                setFormData({ ...formData, nombre: e.target.value });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* Descripción */}
          <div>
            <label className="block uppercase text-sm mb-1">Usuario:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block uppercase text-sm mb-1">Contraseña:</label>
            <input
              type="password"
              maxLength={50}
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          {/* Rol */}
            <div>
              <label className="block uppercase text-sm mb-1">Rol:</label>
              <Select
                options={rolesList}
                value={rolesList.find(op => op.value === formData.idRol) || null}
                onChange={(opcion) => 
                  setFormData({ ...formData, idRol: opcion ? opcion.value : '' })
                }
                placeholder="Seleccione una Urgencia"
                isClearable
                className="text-black"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: '1rem',
                    paddingBottom: '2px',
                    paddingTop: '2px',
                    paddingLeft: '3px',
                    paddingRight: '3px',
                    backgroundColor: 'white',
                    border: `2px solid ${state.isFocused ? '#ff9f47' : '#58585a'}`,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#ff9f47'
                    }
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#000'
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#444' // color placeholder
                  }),
                  menu: (provided) => ({    
                    ...provided,
                    borderRadius: '1rem'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#ff9f47' : '#fff',
                    color: '#000',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  })
                }}
              />
            </div>     

                      {/* Rol */}
            <div>
              <label className="block uppercase text-sm mb-1">Estado:</label>
              <Select
                options={estadosList}
                value={estadosList.find(op => op.value === formData.idEstado) || null}
                onChange={(opcion) => 
                  setFormData({ ...formData, idEstado: opcion ? opcion.value : '' })
                }
                placeholder="Seleccione una Urgencia"
                isClearable
                className="text-black"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: '1rem',
                    paddingBottom: '2px',
                    paddingTop: '2px',
                    paddingLeft: '3px',
                    paddingRight: '3px',
                    backgroundColor: 'white',
                    border: `2px solid ${state.isFocused ? '#ff9f47' : '#58585a'}`,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#ff9f47'
                    }
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#000'
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#444' // color placeholder
                  }),
                  menu: (provided) => ({    
                    ...provided,
                    borderRadius: '1rem'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#ff9f47' : '#fff',
                    color: '#000',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  })
                }}
              />
            </div>    
        </div>
        {/* Errores */}
        {errores.general && (
          <span className="text-red-400 text-center uppercase text-sm">{errores.general}</span>
        )}

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={() => handleGuardar(true)}
          >
            GUARDAR
          </button>
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={() => handleGuardar(false)}
          >
            EDITAR
          </button>
          <button
            onClick={onClose}
            className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
