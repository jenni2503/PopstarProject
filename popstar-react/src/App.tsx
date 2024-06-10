import React from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddArtist from "./components/AddArtist";
import Home from "./components/Home";
import Footer from "./components/Footer";
import EditArtist from "./components/EditArtist";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add" element={<AddArtist />} />
                    <Route path="/edit" element={<EditArtist />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
