import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar(){
  return (
    <header className="site-header">
      <div className="brand">GreenGrocery</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}
