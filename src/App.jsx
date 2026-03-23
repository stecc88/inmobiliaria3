import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminRoute from './components/layout/AdminRoute';
import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import PropertyDetail from './pages/public/PropertyDetail';
import Contact from './pages/public/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PropertyForm from './pages/admin/PropertyForm';
import Inquiries from './pages/admin/Inquiries';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/catalogo" element={<Layout><Catalog /></Layout>} />
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
        <Route path="/contacto" element={<Layout><Contact /></Layout>} />

        {/* Rutas Privadas */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/nueva" element={<AdminRoute><PropertyForm /></AdminRoute>} />
        <Route path="/admin/editar/:id" element={<AdminRoute><PropertyForm /></AdminRoute>} />
        <Route path="/admin/consultas" element={<AdminRoute><Inquiries /></AdminRoute>} />
        <Route path="/admin/ajustes" element={<AdminRoute><Settings /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
