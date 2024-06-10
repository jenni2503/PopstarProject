import React from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav } from "react-bootstrap";

function Navbar() {
    return (
        <BootstrapNavbar bg="light" expand="lg" className="rounded-3 py-3">
        <div className="d-flex justify-content-center w-100">
          <BootstrapNavbar.Brand href="/">Popstars</BootstrapNavbar.Brand>
        </div>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/add">
                        Add artist
                    </Nav.Link>
                    <Nav.Link as={Link} to="/edit">
                        Manage artists
                    </Nav.Link>
                </Nav>
            </BootstrapNavbar.Collapse>
        </BootstrapNavbar>
    );
}

export default Navbar;
