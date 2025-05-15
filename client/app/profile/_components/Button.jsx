"use client";
import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "flex items-center justify-center px-4 py-2 rounded-md font-medium";
  const variants = {
    primary: "bg-sky-900 text-white",
    secondary: "bg-white text-black font-bold",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
