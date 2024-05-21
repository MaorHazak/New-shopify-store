import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/ProductPage.module.css'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel'


import { FaShippingFast } from 'react-icons/fa'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { GoPackage } from 'react-icons/go'





export default function ProductPage({ product }) {
    const [screenWidth, setScreenWidth] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isTiny, setIsTiny] = useState(false)
    // yes im that lazy
    const [isTablet, setIsTablet] = useState(false)
    const [activeImage, setActiveImage] = useState('')

    
    const prodImgs = product?.images?.map((image) => (image.node.src))

    const [index, setIndex] = useState(0)
    const [activeMobileImage, setActiveMobileImage] = useState('')

    const handleImageChangeInc = () => {
      setIndex( index + 1)
      if (index > prodImgs.length - 1 ) {
        setIndex(prodImgs.length- 2)
      }
      setActiveMobileImage(prodImgs[index])
    }

    const handleImageChangeDec = () => {
      setIndex( index - 1)
      if (index <= 0 ) {
        setIndex(prodImgs.length- 1)
      }
      setActiveMobileImage(prodImgs[index])
    }
    
     
    useEffect(() => {
      function watchWidth()  {     
       setScreenWidth(window.innerWidth)
      }

      window.addEventListener("resize", watchWidth)
      watchWidth()
     
   }, [])

   useEffect(() => {

       function mobileScreen() {
           if (screenWidth < 777)  {
               setIsMobile(true)
               setIsTablet(false)
               
          
            } else if ((screenWidth < 1000)) {
                setIsTablet(true)
                setIsMobile(false)
              

            }  else {
               setIsMobile(false)
               setIsTablet(false)
               
           }
       }

       mobileScreen()

   }, [screenWidth])

   
    // console.log(product)

    const handleImage = (image) => {
      setActiveImage(image)
      console.log(activeImage)
    }

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });


    // to abstaract it out
      const addToCart = async (variantId) => {

        let localCartData = JSON.parse(
          window.localStorage.getItem('koopiBlock:shopify:cart')

        
        );

        if (!localCartData.cartId) {
          console.error('woops there was an error loading zi cart')
          return
        }

        console.log(localCartData.cartId)
        console.log(variantId)

         const result = await fetch(`/api/add-to-cart?cartId=${localCartData.cartId}&variantId=${variantId}`, {
           method: 'POST', 
         })

         console.log(result)

         if (!result.ok) {
           console.error('There was a problem adding the item to the cart from slug');
           return;
         }

         window.localStorage.setItem('koopiBlock:shopify:status', 'dirty')

    }

    function ProductDisplay({slug, imageSrc, imageAlt, title, description, descriptionHtml, price, images, variantId }) {

      const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    console.log(descriptionHtml)
  
    return (
    <>
     <div className={styles.backLinkCont}>
      <Link href={`/`}>
          <p className={styles.backLink}><AiOutlineArrowLeft className={styles.backLinkIcon} />חזרה לדף הבית</p>
      </Link>
      </div>
      <div className={styles.productSec}>
        <div className={styles.productImgs}>         
            <div className={styles.imagesConatiner}>
              
              { isMobile ? (
                <>
                <div className={styles.mobileSlideCont}>
                  <div className={styles.mobileSlideArrowCont}>
                    <AiOutlineArrowLeft onClick={handleImageChangeDec}/>
                  </div>
                  <div className={styles.mainImageCont}>
                    <Image 
                      src={activeMobileImage ? (activeMobileImage) : (imageSrc)}
                      alt={activeMobileImage ? (activeMobileImage) : (imageSrc)}
                      width={isTiny ? 500 : 300}
                      height={isTiny ? 500 : 300}
                      className={styles.mainImage}
                      
                    />
                  </div>
                  <div className={styles.mobileSlideArrowCont}>
                    <AiOutlineArrowRight onClick={handleImageChangeInc}/>
                  </div>
                </div>  
                </>
              ) : (
                <>
                  <div className={styles.mainImageCont}>
                      <Image 
                        src={activeImage ? (activeImage) : (imageSrc)}
                        alt={activeImage ? (activeImage) : (imageSrc)}
                        width={isTablet ? 400 : 450}
                        height={isTablet ? 400 : 450}
                        className={styles.mainImage}
                    />
                  </div>
                  <div className={styles.tinyImagesCont}>
                  {images?.map((image, i) => (
                    <div className={styles.tinyImage} key={i}>
                      <Image 
                        src={image.node.src}
                        alt={image.node.src}
                        width={isTablet ? 100 : 150}
                        height={isTablet ? 100 : 150}
                        onClick={() => handleImage(image.node.src)}
                        onMouseOver={() => handleImage(image.node.src)}
                      />           
                    </div>
                  ))}
                </div>
              </>
              )}
              
            </div>
        </div>
        <div className={styles.productCont}>
          <h2 className={styles.productTitle}>{title}</h2>
          <div className={styles.priceContainer}>
            <p className={styles.maham}> כולל מע"מ</p>
            <p className={styles.productPrice}>{formattedPrice.format(price)}</p>
          </div>
          <div className={styles.productDesc}>
           <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
          <div className={styles.ctaContainer}>
            <motion.p className={styles.ctaLink} onClick={() => addToCart(variantId)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.2 }}                        
            >
              הוסף לסלסלה
            </motion.p>
          </div>
          <div className={styles.shippings}>
            <div className={styles.shippingCont}>
              <GoPackage className={styles.shipIcon}/>
              <p className={styles.shipText}>משלוח עד לבית</p>
            </div>
            <div className={styles.shippingCont}>
              <FaShippingFast className={styles.shipIcon}/>
              <p className={styles.shipText}>משלוח עד לבית</p>
            </div>
          </div>
        </div>     
      </div>
    </>
    );
    
  }

    
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description"
                    content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>

                <div className={styles.products}>
                    <ProductDisplay {...product} />
                </div>
            </main>
        </div>
    )
}

export async function getStaticPaths() {

    const url = new URL(process.env.URL || 'http://localhost:3000');
    url.pathname = '/api/product';
   

    const res = await fetch(url.toString());
    
    if (!res.ok) {
        console.error(res);
        return { props: {} };
    }

    const data = await res.json();

    console.log('yeeet',data.products.edges.map(({ node }) => `/product/${node.handle}`))
    

    return {
        paths: data.products.edges.map(({ node }) => `/product/${node.handle}`),
        fallback: true,

    }
}

export async function getStaticProps({ params }) {
    const url = new URL(process.env.URL || 'http://localhost:3000');
    url.pathname = '/api/product';

    const res = await fetch(url.toString());

    if (!res.ok) {
        console.error(res);
        return { props: {} };
    }

    const data = await res.json();


    const product = data.products.edges

        .map(({ node }) => {

            if (node.totalInvetory <= 0) {
                return false;
            }
            return {
                id: node.id,
                title: node.title,
                description: node.description,
                descriptionHtml: node.descriptionHtml,
                images: node.images.edges,
                imageSrc: node.images.edges[0].node.src,
                imageAlt: node.title,
                price: node.variants.edges[0].node.priceV2.amount,
                slug: node.handle,
                variantId: node.variants.edges[0].node.id
            }
        })
        .find(({ slug }) => slug === params.slug)


    return {
        props: { product },
    }
}




