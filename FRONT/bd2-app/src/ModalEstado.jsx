import { useState, useEffect } from 'react';
import { tickets, estados, obtenerTicket, actualizarEstadoTicket } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalEstado({ visible, idTicket, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    idEstadoTicket: null
  });

  const [estadosList, setEstadosList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){

        setFormData({
            idEstadoTicket: null
        });

        setErrores({ ...errores, general: "", correo: ""});

        const cargarDatosTicket = async () => {

            const result = await obtenerTicket(idTicket);

            if (!result.success) {
                setErrores({ general: result.message || "Error al cargar ticket" });
            } else {
                setFormData({
                    idEstadoTicket: result.data.idEstadoTicket
                });

                console.log("Datos del ticket cargados:", result.data.idEstadoTicket);
                setErrores({ general: "" , correo: ""});
            }
        }

        const cargarDatosEstados = async () => {
            const result = await estados();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const estadosListados = (result.data || []).map((p) => ({
                    value: p.idEstadoTicket,
                    label: `${p.Estado}`,
                }));
                setEstadosList(estadosListados);
            }
        };

      cargarDatosTicket();
      cargarDatosEstados();
    }
  }, [visible]);

  const handleGuardar = async (crear = true) => {
    if(crear){
      const result = await actualizarEstadoTicket({ idTicket, ...formData });

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
        <h2 className="text-2xl text-center mb-6">EDITAR ESTADO DEL TICKET</h2>

        {/* Formulario */}


          {/* Categoría */}
            <div>
              <label className="block uppercase text-sm mb-1">Estado:</label>
              <Select
                options={estadosList}
                value={estadosList.find(op => op.value === formData.idEstadoTicket) || null}
                onChange={(opcion) =>
                  setFormData({ ...formData, idEstadoTicket: opcion ? opcion.value : '' })
                }
                placeholder="Seleccione un Estado"
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
