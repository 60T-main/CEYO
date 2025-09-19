import React from 'react';
import { useState } from 'react';

const Footer = ({}) => {
  return (
    <footer className="footer">
      <div className="footer-content-parent">
        <h4 className="about-us inline-font">ჩვენ შესახებ</h4>
        <h4 className="catalogue inline-font">წესები და პირობები</h4>
        <h4 className="contact inline-font">კონტაქტი</h4>
        <div className="social-parent">
          <i className="social-icon fa-brands fa-facebook"></i>
          <i className="social-icon fa-brands fa-facebook-messenger"></i>
          <i className="social-icon fa-brands fa-instagram"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
