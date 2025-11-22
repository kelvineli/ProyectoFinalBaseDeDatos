import { useState, useEffect } from 'react';
import { tickets, categorias, urgencias, insertarTicket, obtenerTicket, actualizarTicket } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [ticketSeleccionado, setTicketSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    idCategoria: '',
    idUrgencia: '',
    idCreador: localStorage.getItem("idUsuario"),
    idEstadoTicket: '',
    idTecnico: ''
  });

  const [ticketsList, setTicketsList] = useState([]);
  const [categoriasList, setCategoriasList] = useState([]);
  const [urgenciasList, setUrgenciasList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setTicketSeleccionado('');

        setFormData({
            titulo: '',
            descripcion: '',
            idCategoria: '',
            idUrgencia: '',
            idCreador: localStorage.getItem("idUsuario"),
            idEstadoTicket: '',
            idTecnico: ''
        });

        setErrores({ ...errores, general: "", correo: ""});

    const traerTickets = async () => {
        if(localStorage.getItem("idRol") === "2"){
const result = await obtenerTicketTecnico(localStorage.getItem("idUsuario"));
        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setTicketsList(result.data);
        }
        }else{
            const result = await tickets();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setTicketsList(result.data);
        }
        }
        
    };

        const cargarDatosCategoria = async () => {
            const result = await categorias();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const categoriasListados = (result.data || []).map((p) => ({
                    value: p.idCategoriaTicket,
                    label: `${p.Categoria}`,
                }));
                setCategoriasList(categoriasListados);
            }
        };

        const cargarDatoUrgencias = async () => {
            const result = await urgencias();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const categoriasListados = (result.data || []).map((p) => ({
                    value: p.idUrgencia,
                    label: `${p.Urgencia}`,
                }));
                setUrgenciasList(categoriasListados);
            }
        };

      traerTickets();
      cargarDatosCategoria();
      cargarDatoUrgencias();
    }
  }, [visible]);

  // Cuando se selecciona un ticket cargar sus datos
  useEffect(() => {
    const obtenerDatosTicket = async () => {
      if (!ticketSeleccionado) {
        setFormData({
          titulo: '',
          descripcion: '',
          idCategoria: '',
          idUrgencia: '',
          idCreador: localStorage.getItem("idUsuario"),
          idEstadoTicket: '',
          idTecnico: ''
        });
        return;
      }

      const result = await obtenerTicket(ticketSeleccionado);

      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar ticket" });
      } else {
        setFormData({
          titulo: result.data.Titulo,
          descripcion: result.data.Descripcion,
          idCategoria: result.data.idCategoriaTicket,
          idUrgencia: result.data.idUrgencia,
          idCreador: localStorage.getItem("idUsuario"),
          idEstadoTicket: result.data.idEstadoTicket,
          idTecnico: result.data.idTecnico
        });
        setErrores({ general: "" , correo: ""});
      }
    };

    obtenerDatosTicket();
  }, [ticketSeleccionado]);

  const handleGuardar = async (crear = true) => {
    if(crear){
      const result = await insertarTicket(formData);

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Ticket guardado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }else{
      const result = await actualizarTicket({ idTicket: ticketSeleccionado, ...formData });

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Ticket editado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">CREAR / EDITAR TICKET</h2>

        {/* Selección de Tickets */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione un ticket existente (opcional):</label>
          <Select
            options={ticketsList}
            value={ticketsList.find(op => op.value === ticketSeleccionado) || null}
            onChange={(opcion) => setTicketSeleccionado(opcion ? opcion.value : '')}
            placeholder="--- Nuevo Ticket ---"
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
            <label className="block uppercase text-sm mb-1">Título del Ticket:</label>
            <input
              type="text"
              maxLength={150}
              value={formData.titulo}
              onChange={(e) => {
                setFormData({ ...formData, titulo: e.target.value });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* Descripción */}
          <div>
            <label className="block uppercase text-sm mb-1">Descripción:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          {/* Categoría */}
            <div>
              <label className="block uppercase text-sm mb-1">Categoria:</label>
              <Select
                options={categoriasList}
                value={categoriasList.find(op => op.value === formData.idCategoria) || null}
                onChange={(opcion) =>
                  setFormData({ ...formData, idCategoria: opcion ? opcion.value : '' })
                }
                placeholder="Seleccione una Categoría"
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
                    color: '#444'
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

          {/* Urgencia */}
            <div>
              <label className="block uppercase text-sm mb-1">Urgencia:</label>
              <Select
                options={urgenciasList}
                value={urgenciasList.find(op => op.value === formData.idUrgencia) || null}
                onChange={(opcion) => 
                  setFormData({ ...formData, idUrgencia: opcion ? opcion.value : '' })
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
