import { useState } from "react";
import { login } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(usuario, pass);
        //console.log(result);

        if(!result.success){
            setError(true);
        }else{
            localStorage.setItem('idUsuario', result.user.idUsuario);
            localStorage.setItem('Nombre', result.user.Nombre);
            localStorage.setItem('Usuario', result.user.Usuario);
            localStorage.setItem('idRol', result.user.idRol);

            console.log(localStorage.getItem('idUsuario') + "---" + localStorage.getItem('Nombre') + "---" + localStorage.getItem('Usuario') + "---" + localStorage.getItem('idRol'));

            navigate('/inicio');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">

            {/* Logo 
            <img src={logo} alt="Logo" className="w-72 mb-6" /> 
            */}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
                <input
                type="text"
                placeholder="Ingrese su usuario..."
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-70 px-4 py-3 rounded-full bg-[#58585a] text-white placeholder-gray-200 focus:outline-none"
                />
                <input
                type="password"
                placeholder="Ingrese su contraseña..."
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-70 px-4 py-3 rounded-full bg-[#58585a] text-white placeholder-gray-200 focus:outline-none"
                />
                <button
                type="submit"
                className="w-70 py-3 text-white bg-[#f68b26] font-medium rounded-full"
                    style={{ backgroundColor: '#f68b26' }}
                >
                Iniciar Sesión
                </button>
                {error && (
                <span className="text-red-600 underline text-sm">Usuario o contraseña incorrectos</span>
                )}
            </form>
        </div>
    );
}

export default Login;
