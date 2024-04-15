import React from 'react';
import './Breadcrum.css';
import arrowIcon from '../Assets/angle-right.png';

const Breadcrum = ({ product }) => {
  // Check if product is available before accessing its properties
  if (!product) return null;

  return ( 
    <div className='breadcrumb'>
      <span>Home</span>
      <img src={arrowIcon} alt="Arrow" />
      <span>Shop</span>
      <img src={arrowIcon} alt="Arrow" />
      <span>{product.category}</span>
      <img src={arrowIcon} alt="Arrow" />
      <span>{product.name}</span>
    </div>
  );
}

export default Breadcrum;
