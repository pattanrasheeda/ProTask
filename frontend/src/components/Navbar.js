import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fs-4 fw-bold" to="/">📚 ProTask</Link>
        <div>
          <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
          <Link className="btn btn-light" to="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;