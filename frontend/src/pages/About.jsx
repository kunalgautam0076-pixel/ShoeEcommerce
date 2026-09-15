import React from 'react';

const About = () => {
  return (
    <div className="page-container container about-page">
      <div className="page-header">
        <h1>About <span className="highlight">ShoeX</span></h1>
      </div>
      <div className="about-content glass-panel">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>Founded in 2024, ShoeX was built on the idea that premium footwear should be accessible, stylish, and highly comfortable. We started as a small team of shoe enthusiasts and grew into a brand loved by athletes and casual wearers alike.</p>
          
          <h2>Our Mission</h2>
          <p>To empower every step you take by providing high-quality shoes that blend innovative design with unmatched comfort. We believe your shoes should carry you further, faster, and in style.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
