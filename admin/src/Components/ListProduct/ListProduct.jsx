import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from "../../assets/cross_icon.png"

const ListProduct = () => {
   //api integration
    const [allproducts,setAllProducts] = useState([]);
    
    // const fetchInfo = async () =>{
    //   await fetch("http://localhost:4000/allproduct")
    //   .then((resp)=>resp.json())
    //   .then((data)=>{setAllProducts(data)})
    // }
    const fetchInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/allproducts");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    useEffect(()=>{
      fetchInfo();
    },[])

    const remove_product = async(id)=>{
      await fetch("http://localhost:4000/removeproduct",{
        method:'post',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
      })
      await fetchInfo();
    }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
       <div className="listproduct-format-main">
        <p>Products</p>
        <p className='product_title'>Title</p>
        <p className='product_oldprice'>Old Price</p>
        <p className='product_newprice'>New Price</p>
        <p className='product_category'>Category</p>
        <p className='product_remove'>Remove</p>
       </div>
       <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          return <> <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="" className="listproduct-remove-icon" />
          </div>
          <hr /></>

        })}
        
       </div>
    </div>
  )
}

export default ListProduct
