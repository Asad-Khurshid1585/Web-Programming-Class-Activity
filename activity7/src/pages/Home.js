import React from 'react';

export default function Home(){
  return (
    <div className="page home">
      <h2>Welcome to GreenGrocery</h2>
      <p>Your friendly neighborhood grocery store in G-6, Islamabad, Pakistan.</p>
      <div className="hero">
        <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80" alt="fresh produce"/>
      </div>
      <section>
        <h3>Fresh produce</h3>
        <p>We offer fresh fruits, vegetables, and everyday essentials.</p>
      </section>
    </div>
  );
}
