import ReactDOM from "react-dom";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import React from 'react';
import CustomNavbar from './components/Headers/CustomNavbar';
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import AdminLayout from "layouts/Admin.js";
import { Web3Provider } from './Web3Context';

const Index = () => {
  return (
    <Web3Provider>
      <HashRouter>
        <CustomNavbar />
        <Routes>
          <Route path="/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </Web3Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
