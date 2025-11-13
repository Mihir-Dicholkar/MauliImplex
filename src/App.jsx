import React, { useState } from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from './pages/Gallery';
import Certification from './pages/certification';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/certification' element={<Certification/>}/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery/>}/>
      </Routes>
    </>
  );
}

export default App
