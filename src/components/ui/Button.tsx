import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
}

export function Button({ variant = 'primary', href, className, children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-earth-900 text-white hover:bg-earth-500 cursor-pointer",
    secondary: "bg-blue-500 text-white hover:bg-blue-900 cursor-pointer",
    outline: "border border-earth-900 text-earth-900 hover:bg-earth-100 cursor-pointer"
  };
  
  const classes = `${baseStyles} ${variants[variant]} ${className || ''}`;

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
