import React from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Inventory from "./pages/Inventory";

import ExistingMedia from "./pages/ExistingMedia";
import Inquiry from "./pages/Inquiry";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
    const location = useLocation();

    return(
      
    <AnimatePresence mode="wait">
      
        <Routes location={location} key={location.pathname} >
            * <Route path="/" element={<Login/>}/> 
             {/* Protected Routes */}
       <Route element={<ProtectedRoute />}>
        <Route path="/admin/*" element={<Dashboard />}>
          <Route index element={<Upload />} /> {/* Default page */}
          <Route path="upload" element={<Upload />} />
          <Route path="existing-media" element={<ExistingMedia />} />
          <Route path="inventory" element={<Inventory />} />
          {/* <Route path="edit/:id" element={<EditProduct />} /> */}
          {/* <Route path="logs" element={<Logs />} /> */}
          <Route path="inquiry" element={<Inquiry />} />
        </Route>
      </Route>
           {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
        </Routes>
        </AnimatePresence>
    )
}
export default App;