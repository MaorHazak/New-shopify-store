import Link from 'next/link'
import Image from 'next/image'
import {
        AiOutlineClose,
        AiOutlineMenu,
        AiOutlineShopping,
        AiOutlinePlusCircle,
        AiOutlineMinusCircle,
        AiOutlineDelete,
        AiOutlineShoppingCart, 
      } from 'react-icons/ai'
import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, delay } from 'framer-motion'
import mainLogo from '../../../public/shekemLight.png'
 
const Navbar = () => {

    const [screenWidth, setScreenWidth] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [open, setOpen] = useState(false)

    const animMenu = {
      exit: {
        opacity: 0,
        height: 0,
        transtion: {
          ease: "easeInOut",
          duration:0.3,
          delay: 1.2,
        }
      },
      open: {height: "35em", opacity:1},
      
    }


    //cart bellow:

    const [cart, setCart] = useState({ id: null, lines: [] });
    const [cartOpen, setCartOpen ] = useState(true);

  //   useEffect(() => {
  //  console.log("cart here", cart)

  //   },[cart])

    // const toggleOpenCart = async () => {
    //   setCartOpen(true)
    // }
  
    // screen width
    useEffect(() => {
      // possible to log it but need to add [cart] at end.
      // console.log("cart:", cart)
       function watchWidth()  {     
        setScreenWidth(window.innerWidth)
       }

       window.addEventListener("resize", watchWidth)
       watchWidth()
      
    },)

    // screen width
    useEffect(() => {

        function mobileScreen() {
            if (screenWidth < 980)  {
                setIsMobile(true)
            } else {
                setIsMobile(false)
                setOpen(false)
            }
        }

        mobileScreen()

    }, [screenWidth])


    // get cart
    useEffect(() => {
      
      const getCart = async () => {

          let localCartData = JSON.parse(
              window.localStorage.getItem('koopiBlock:shopify:cart')
          );
          // console.log("localCartData", localCartData )

          if (localCartData) {

              const cartObj = localCartData

              const exsitingCart = await fetch(`/api/load-cart?cartId=${cartObj.cartId}`
              ).then((res) => res.json())

              setCart({
                id: localCartData.cartId,
                checkoutUrl: localCartData.checkoutUrl,
                estimatedCost: exsitingCart?.body.cart ? (exsitingCart.body.cart.estimatedCost ? exsitingCart.body.cart.estimatedCost.totalAmount : null) : null,
                lines: exsitingCart?.body.cart ? (exsitingCart.body.cart.lines?.edges || []) : [],
              });
              

             
             
             

              return;           

              
          }

          localCartData = await fetch(`/api/create-cart`).then((res) => res.json()) 

          // not log anything
          // console.log("localCartData", localCartData)

          setCart({
              id: localCartData.cartId,
              checkoutUrl: localCartData.checkoutUrl,
              estimatedCost: null,
              lines: [],
          })

          
          

          

          window.localStorage.setItem(
              'koopiBlock:shopify:cart',
              JSON.stringify(localCartData),
            );
      }

      getCart();

      const interval = setInterval(() => {

          const state = window.localStorage.getItem('koopiBlock:shopify:status');
    
          if (state && state === 'dirty') {
            getCart();
            setCartOpen(!cartOpen)
            
           
            window.localStorage.setItem('koopiBlock:shopify:status', 'clean');
            
          }

          return () => clearInterval(interval);

        }, 500);

        
      // work
      // console.log("cart", cart)

  }, [])

// Navbar.jsx

const addToCart = async (variantId) => {
  let localCartData = JSON.parse(
    window.localStorage.getItem('koopiBlock:shopify:cart')
  );

  if (!localCartData || !localCartData.cartId) {
    console.error('Oops! There was an error loading the cart.');
    return;
  }

  const result = await fetch(`/api/add-to-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId: localCartData.cartId,
      variantId,
    }),
  });

  // not log anything
  // console.log("from Navbar",result);

  if (!result.ok) {
    console.error('There was a problem adding the item to the cart from Navbar component');
    return;
  }

  window.localStorage.setItem('koopiBlock:shopify:status', 'dirty');
};


  


    const toggleCart = () => {
      setCartOpen(!cartOpen);
      console.log(cartOpen)
    } 

    //undefined 
    // console.log("cart",cart)

    const menuOpen = () => {
        setOpen(!open)
    }

    const menuClose = () => {
      setOpen(false)
    }

    // this to shekelzzz

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const deleteItem = async (lineId) => {
      let localCartData = JSON.parse(
        window.localStorage.getItem('koopiBlock:shopify:cart')   
      );
  
      console.log(lineId)
  
      const result = await fetch(`/api/delete-from-cart?cartId=${localCartData.cartId}&variantId=${lineId}`, {
             method: 'POST', 
      })
  
      window.localStorage.setItem('koopiBlock:shopify:status', 'dirty')
    }


    const decQuantity = async (lineId, qtNum) => {

      let localCartData = JSON.parse(
        window.localStorage.getItem('koopiBlock:shopify:cart')   
      );
  
      console.log(lineId)
      console.log(qtNum)

      const newQt = qtNum - 1

      if ( newQt <= 0 ) {
        const result = await fetch(`/api/delete-from-cart?cartId=${localCartData.cartId}&variantId=${lineId}`, {
          method: 'POST', 
        })
      } else {
        const result = await fetch(`/api/change-cart-qt?cartId=${localCartData.cartId}&variantId=${lineId}&itemQt=${newQt}`, {
              method: 'POST', 
        })
    }
  
      window.localStorage.setItem('koopiBlock:shopify:status', 'dirty')



    }
  
    
  return (
    <>
        <div className={styles.navbarWrap}>
        <header className={styles.navbar}>
        <div >
          <div>
            { cartOpen ?    

                <div className={styles.menuIcon} onClick={() => toggleCart()}> 
                      <AiOutlineShopping />
                </div>        
            :
                <div className={styles.menuIcon} onClick={() => toggleCart()}>
                      <AiOutlineClose />
                </div>
                
            }
          </div>
        </div>        
        <div className={styles.logoContainer}>  
          <h3 className={styles.logo}>
            <Link href="/" className={styles.logoLink} onClick={menuClose} >
              <Image 
                src={mainLogo.src}
                alt={'hello there'}
                width={isMobile ? 100 : 180}
                height={isMobile ? 50 : 80}
              />
            </Link>
          </h3>
        </div>
        { isMobile ? 
        <>

        { open ?
         <>
            <div>
                <AiOutlineClose className={styles.menuIcon} onClick={menuOpen}/>
            </div>
            
         </>
         :
         <>
            <div>
                <AiOutlineMenu className={styles.menuIcon} onClick={menuOpen}/>
            </div>
         </>
         }
        
        </> 
        :   
        <>
        <div className={styles.menuContainer}>
            <ul className={styles.linksList}>
              <motion.li className={styles.linkWrap}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/" className={styles.link}>התקנות</Link>
              </motion.li>
              <motion.li className={styles.linkWrap}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/" className={styles.link}>אודותנו</Link>
              </motion.li>
              <motion.li className={styles.linkWrap}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/" className={styles.link}>מידע מקצועי</Link>
              </motion.li>
              <motion.li className={styles.linkWrap}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/" className={styles.link}>חנות</Link>
              </motion.li>
              <motion.li className={styles.linkWrap} 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/" className={styles.link} id={styles.cta}>צרו קשר 📞</Link> 
              </motion.li>
            </ul>
          </div>
        </>}
     
       </header>
      </div>
       <AnimatePresence>

        {/* this mobile menues when opened! */}

       {open &&
        
        <>
          <motion.div
           className={styles.MobileMenuContainer}
           onClick={menuClose}
           variants={animMenu}
           initial={{height: 0, opacity: 0}}
           animate={{height: "100vh", opacity:1}}
           transition={{duration: .5}}
           exit="exit"
          >
              <ul className={styles.MobileLinksList}>
                  <motion.li className={styles.MobileLinkWrap} onClick={menuClose}
                     initial={{y:80,opacity:0}}
                     animate={{y:0, opacity:1}}
                     transition={{delay:.8}}
                     exit={{
                      opacity:0,
                      y:90,
                        transition:{
                          ease:"easeInOut",
                          delay:1
                        }
                     }}
                  >
                      <Link href="/" className={styles.link}>חנות</Link>
                  </motion.li>
                  <motion.li className={styles.MobileLinkWrap} onClick={menuClose}
                    initial={{y:80,opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{delay:.7}}
                    exit={{
                     opacity:0,
                     y:90,
                       transition:{
                         ease:"easeInOut",
                         delay:.8
                       }
                    }}
                  >
                      <Link href="/" className={styles.link}>אודותנו</Link>
                  </motion.li>
                  <motion.li className={styles.MobileLinkWrap} onClick={menuClose}
                    initial={{y:80,opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{delay:.6}}
                    exit={{
                     opacity:0,
                     y:90,
                       transition:{
                         ease:"easeInOut",
                         delay:.6
                       }
                    }}
                  >
                      <Link href="/" className={styles.link}>מידע מקצועי</Link>
                  </motion.li>
                  <motion.li className={styles.MobileLinkWrap} onClick={menuClose}
                    initial={{y:80,opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{delay:.5}}
                    exit={{
                     opacity:0,
                     y:90,
                       transition:{
                         ease:"easeInOut",
                         delay:.4
                       }
                    }}
                  >
                      <Link href="/" className={styles.link}>התקנות</Link>
                  </motion.li>
                  <motion.li className={styles.MobileLinkWrap} onClick={menuClose}
                    initial={{y:80,opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{delay:.4}}
                    exit={{
                     opacity:0,
                     y:90,
                       transition:{
                         ease:"easeInOut",
                         delay:.2
                       }
                    }}
                  >
                      <Link href="/" className={styles.link} id={styles.cta} onClick={menuClose}>צרו קשר 📞</Link> 
                  </motion.li>
              </ul>
          </motion.div>
        </>
       }

       {/* this mobile cart when opened! */}

       { cartOpen ? 
                <></>
                :
                <motion.div 
                  className={styles.cartContainer}
                  variants={animMenu}
                  initial={{height: 0, }}
                  animate={cartOpen ? "exit" : "open"}
                  transition={{duration: .5}}
                  exit="exit"
                >
                    <motion.div className={styles.listContainer}
                    >
                      { cart.lines.length > 0 ? (
                      <motion.ul 
                        className={styles.cartList}
                        variants={animMenu}
                        initial={{height: 0, opacity: 0}}
                        animate={{ height: '10em', opacity:1}}
                        transition={{duration: .5}}
                        exit="exit"
                      >
                          {cart.lines.map(({ node: item }) => (
                              <li key={item.merchandise?.id} className={styles.cartListItem}>
                                <div className={styles.productContainer}>
                                  <div className={styles.ImageCont}> 
                                    {item.merchandise?.product?.images.edges.map(({ node: image }) => (
                                      <Image
                                        key={image.url}
                                        src={image.url}
                                        alt={'imagine'}
                                        width={100}
                                        height={100}
                                      />
                                    ))}
                                  </div>
                                  <div className={styles.productWrapper}>
                                    <div className={styles.titleWrap}>
                                      <p className={styles.product}>
                                        {item.merchandise?.product?.title}
                                      </p>
                                      <AiOutlineDelete className={styles.deleteBtn} onClick={() => deleteItem(item.id)}/>
                                    </div>
                                    <div className={styles.btnsContainer}>
                                      <p className={styles.productsPrice}>
                                          {item.quantity * item.merchandise?.priceV2.amount}
                                      </p>
                                      <div className={styles.qtOutline}>
                                        <button onClick={() => addToCart(item.merchandise?.id)} className={styles.qtBtn}><AiOutlinePlusCircle /></button>
                                        <p className={styles.qt}>{item.quantity}</p>
                                        <button onClick={() => decQuantity(item.id, item.quantity )} className={styles.qtBtn}><AiOutlineMinusCircle /></button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.lineBreak} />
                              </li>
                          ))}
                      </motion.ul>
                      ) : (
                        <>
                        <div className={styles.emptyCartCont}>
                          <AiOutlineShopping className={styles.emptyCart}/>
                          <p className={styles.emptyCartText}>הסלסלה שלך ריקה</p>
                        </div>
                        </>
                      )}
                    </motion.div>
                    <motion.div className={styles.containerCont}
                      variants={animMenu}
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "10em", opacity:1}}
                      transition={{duration: 1.6}}
                      exit="exit"
                    >
                      <div className={styles.totalPriceWrapper}>
                        <p className={styles.totalPrice}>:סהכ לתשלום </p> 
                        <p className={styles.totalPrice}>{cart.estimatedCost?.amount} </p>
                      </div>
                      
                      <div className={styles.buttonContainer}>
                          <Link  href={`${cart.checkoutUrl}`}>
                              <p className={styles.ctaButton} >מעבר לתשלום</p> 
                          </Link>
                      </div>
                    </motion.div>
                    
                </motion.div>
            }    

       </AnimatePresence>
    </>
  )
}

export default Navbar