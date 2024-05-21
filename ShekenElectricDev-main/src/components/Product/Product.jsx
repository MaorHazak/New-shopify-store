import React,{ useEffect} from 'react'
import styles from './Product.module.css'
import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'framer-motion'

const Product = ({ product }) => {

    // console.log(product)

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });


    
const addToCart = async () => {
  // Ensure product.variantId is not undefined before calling addToCart
  if (!product.id) {
    console.error('Variant ID is missing.');
    return;
  }

  // Retrieve cartId from localStorage or another source
  // const cartId = localStorage.getItem('cartId'); // Example, replace with your actual implementation
  const cartDataString = localStorage.getItem('koopiBlock:shopify:cart');
  const cartData = JSON.parse(cartDataString);
  let cartId = cartData.cartId;
  console.log("cartId",cartId);


  try {
    const result = await fetch(`/api/add-to-cart?cartId=${cartId}&variantId=${product.id}`, {
      method: 'POST',
    });

    if (!result.ok) {
      console.error('There was a problem adding the item to the cart from Product component.');
      return;
    }

    // Optionally handle success response here
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

    

  //   useEffect(() => {
      

  //         let localCartData1 = JSON.parse(
  //             window.localStorage.getItem('koopiBlock:shopify:cart')
  //         );

  //         console.log("localCartData1", localCartData1)

  // }, [])

  return (
    <div className={styles.product}>
      <Link href={`/product/${product.slug}`}>
        <Image src={product.imageSrc} alt={product.imageAlt} width={250} height={250} />
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.price}>{formattedPrice.format(product.price)}</p>
      </Link>
      <div className={styles.ctaContainer}>     
        <motion.p className={styles.ctaLink} onClick={() => addToCart(product.id)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.2 }}                        
        >
          הוסף לסלסלה
        </motion.p>
      </div>
    </div>
  );
}

export default Product