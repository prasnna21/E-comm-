import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>An e-commerce website is an online platform that facilitate
                buying and selling of products or services over the internet 
                It serves as a virtual marketplace where bussiness and indivisuals can 
                showcase their products, interact with customers, and conduct
                transaction without the need of physical presence. E-commerce 
                websites have gained immense popularity due to their convenient 
                accessibility, and the global reach they offer. 
            </p>
            <p>
                E-commerce website typically display products or services 
                along with detailed description, images, prices and any 
                available variations(eg. sizes,colors) . 
                Each products usually has its own dedicated page with 
                relevent information.

            </p>
        </div>

      
    </div>
  )
}

export default DescriptionBox
