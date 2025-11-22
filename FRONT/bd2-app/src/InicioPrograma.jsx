import { useState, useEffect } from "react";
import { tickets, usuarios, obtenerTicketTecnico } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { useToast } from './assets/ToastProvider';
import { FaTrash, FaPlus, FaCircle, FaUser, FaFile, FaArrowCircleLeft} from 'react-icons/fa';
import ModalFormulario from './ModalTickets';
import ModalUsuario from './ModalUsuario';
import ModalEstado from './ModalEstado';
import ModalTecnico from './ModalTecnico';
import ModalNota from './ModalNotas';

function Inicio() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
    const [mostrarModalTecnico, setMostrarModalTecnico] = useState(false);
    const [mostrarModalNota, setMostrarModalNota] = useState(false);
    const [idTicketSeleccionado, setIdTicketSeleccionado] = useState(null);

    const [ticketsList, setTicketsList] = useState([]);

    const [usuariosList, setUsuariosList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const nombreUsuario = localStorage.getItem("Usuario");
        const rol = localStorage.getItem('idRol');

        // Si no está logueado → redirigir
        if (!idUsuario || !nombreUsuario || !rol) {
            navigate("/");
            return;
        } else {
            traerTickets();
            traerusuarioss();
        }
    }, []);

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

    const traerusuarioss = async () => {
        const result = await usuarios();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setUsuariosList(result.data);
        }
    };

    const handleLogout = async () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">

            {/* Botón a la derecha en pantallas grandes */}
            <div className="md:ml-auto mr-50">
                <button
                    onClick={() => setMostrarModal(true)}
                    className="flex items-center gap-2 bg-[#f68b26] text-white rounded-full px-4 py-2 font-semibold"
                >
                    CREAR/EDITAR TICKET <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>TICKETS:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">ID</th>
                            <th className="p-3 text-center font-medium">TITULO</th>
                            <th className="p-3 text-center font-medium">DESCRIPCIÓN</th>
                            <th className="p-3 text-center font-medium">CATEGORÍA</th>
                            <th className="p-3 text-center font-medium">URGENCIA</th>
                            <th className="p-3 text-center font-medium">ID CREADOR</th>
                            <th className="p-3 text-center font-medium">NOMBRE CREADOR</th>
                            <th className="p-3 text-center font-medium">ID TÉCNICO</th>
                            <th className="p-3 text-center font-medium">NOMBRE TÉCNICO</th>
                            <th className="p-3 text-center font-medium">ESTADO</th>
                            <th className="p-3 text-center font-medium">FECHA CREACIÓN</th>
                            <th className="p-3 text-center font-medium">FECHA ACTUALIZACIÓN</th>
                            <th className="p-3 text-center font-medium">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketsList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.idTicket}</td>
                                <td className="p-3 text-center">{p.Titulo}</td>
                                <td className="p-3 text-center">{p.Descripcion}</td>
                                <td className="p-3 text-center">{p.Categoria}</td>
                                <td className="p-3 text-center">{p.Urgencia}</td>
                                <td className="p-3 text-center">{p.idCreador}</td>
                                <td className="p-3 text-center">{p.NombreCreador}</td>
                                <td className="p-3 text-center">{p.idTecnico}</td>
                                <td className="p-3 text-center">{p.NombreTecnico}</td>
                                <td className="p-3 text-center">{p.EstadoTicket}</td>
                                <td className="p-3 text-center">{p.FechaCreacion}</td>
                                <td className="p-3 text-center">{p.FechaActualizacion}</td>
                                <td className="p-3 text-center">
                                    <button 
                                    onClick={() => {
                                        setIdTicketSeleccionado(p.idTicket);
                                        setMostrarModalEstado(true);
                                    }}
                                    className="text-green-700 hover:text-[#58585a] mr-3"
                                    >
                                    <FaCircle size={30} />
                                    </button>
                                    <button 
                                    onClick={() => {
                                        setIdTicketSeleccionado(p.idTicket);
                                        setMostrarModalTecnico(true);
                                    }}
                                    className="text-blue-700 hover:text-[#58585a] mr-3"
                                    >
                                    <FaUser size={30} />
                                    </button>
                                    <button 
                                    onClick={() => {
                                        setIdTicketSeleccionado(p.idTicket);
                                        setMostrarModalNota(true);
                                    }}
                                    className="text-purple-700 hover:text-[#58585a] mr-3"
                                    >
                                    <FaFile size={30} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ticketsList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay tickets registrados
                    </p>
                )}
            </div>

            {error && <span className="text-red-600 underline text-sm">{error}</span>}

{/* Solo mostrar si idRol === 3 */}
{localStorage.getItem("idRol") === "3" && (
    <>
        <div className="md:ml-auto mr-50">
            <button
                onClick={() => setMostrarModalUsuario(true)}
                className="flex items-center gap-2 bg-[#f68b26] text-white rounded-full px-4 py-2 font-semibold"
            >
                CREAR/EDITAR USUARIO <FaPlus />
            </button>
        </div>

        <div className="flex items-center gap-2">
            <span className='text-sm whitespace-nowrap'>USUARIOS:</span>
        </div>

        {/* Tabla con scroll */}
        <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
            <table className="min-w-full text-left">
                <thead className="sticky top-0 bg-white">
                    <tr className="border-b-2 border-gray-300">
                        <th className="p-3 text-center font-medium">ID</th>
                        <th className="p-3 text-center font-medium">NOMBRE</th>
                        <th className="p-3 text-center font-medium">USUARIO</th>
                        <th className="p-3 text-center font-medium">ID ROL</th>
                        <th className="p-3 text-center font-medium">ESTADO</th>
                        <th className="p-3 text-center font-medium">FECHA CREACIÓN</th>
                        <th className="p-3 text-center font-medium">FECHA ACTUALIZACIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosList.map((p, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-center">{p.idUsuario}</td>
                            <td className="p-3 text-center">{p.Nombre}</td>
                            <td className="p-3 text-center">{p.Usuario}</td>
                            <td className="p-3 text-center">{p.idRol}</td>
                            <td className="p-3 text-center">{p.idEstadoUsuario}</td>
                            <td className="p-3 text-center">{p.FechaCreacion}</td>
                            <td className="p-3 text-center">{p.FechaModificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {usuariosList.length === 0 && !error && (
                <p className="text-center text-gray-600 underline mt-5 text-sm">
                    No hay usuarios registrados
                </p>
            )}
        </div>
    </>
)}

            <button onClick={handleLogout} className="text-[#58585a] hover:text-[#f68b26] w-10 mt-10">
                <FaArrowCircleLeft size={45} />
          </button> 




            {/* Modal */}
            <ModalFormulario 
                visible={mostrarModal} 
                onClose={() => setMostrarModal(false)} 
                onGuardado={async () => {
                setMostrarModal(false);
                await traerTickets();
                }}
            />

            {/* Modal */}
            <ModalUsuario
                visible={mostrarModalUsuario} 
                onClose={() => setMostrarModalUsuario(false)} 
                onGuardado={async () => {
                setMostrarModalUsuario(false);
                await traerusuarioss();
                }}
            />
            <ModalEstado
                visible={mostrarModalEstado} 
                idTicket={idTicketSeleccionado}
                onClose={() => setMostrarModalEstado(false)} 
                onGuardado={async () => {
                setMostrarModalEstado(false);
                await traerTickets();
                }}
            />
            <ModalTecnico
                visible={mostrarModalTecnico}
                idTicket={idTicketSeleccionado}
                onClose={() => setMostrarModalTecnico(false)} 
                onGuardado={async () => {   
                setMostrarModalTecnico(false);
                await traerTickets();
                }}
            />
            <ModalNota
                visible={mostrarModalNota}
                idTicket={idTicketSeleccionado}
                onClose={() => setMostrarModalNota(false)} 
                onGuardado={async () => {   
                setMostrarModalNota(false);
                await traerTickets();
                }}
            />  
        </div>
    );
}

export default Inicio;
