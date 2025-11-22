import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import Login from './Login'
import InicioPrograma from './InicioPrograma';

function App() {
  return (
    <Routes>    
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<InicioPrograma />} />
    </Routes>
  )
}

export default App
