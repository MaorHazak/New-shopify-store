import Head from 'next/head';
import shuffle from 'lodash.shuffle';

import styles from '../styles/Home.module.css';
import { getAllCategories } from '../utils/graphql';
import { Product, Header } from '@/components';
// import { Product, Header } from '@/components';
import { useState, useEffect } from 'react';



export async function getServerSideProps() {
  const CategoriesData = await getAllCategories();

  const url = new URL(process.env.URL || 'http://localhost:3000');
  url.pathname = '/api/create-cart';

  const cartRes = await fetch(url.toString());

  if (!cartRes.ok) {
    console.error(cartRes);
    return { props: { categories: CategoriesData, cart: {} } };
  }

  const cartData = await cartRes.json();

  return {
    props: {
      categories: CategoriesData,
      cart: cartData,
    },
  };
}

const Home = ({ categories, cart }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [shuffledProducts, setShuffledProducts] = useState([]);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = categories.find((category) => category.id === categoryId);
      // console.log(categoryId);
      const products = selectedCategory ? selectedCategory.products : [];
      const shuffledProducts = shuffle(products);
      setShuffledProducts(shuffledProducts);
    }
  }, [categoryId, categories]);

  const handleCategoryClick = (categoryId) => {
    setCategoryId(categoryId);
  };

  // const addToCart = (variantId) => {
  //   // Placeholder implementation for adding to cart
  //   console.log('Adding product to cart:', variantId);
  //   // Implement your logic for adding the product to the cart here
  // };

  const selectedCategory = categories.find((category) => category.id === categoryId);
  // undefined
  // console.log(categoryId);

  return (
    <div className={styles.container}>
      <Head>
        <title>{selectedCategory?.title}</title>
        <meta name="description" content={selectedCategory?.description} />
      </Head>
      <div>
        <Header title={selectedCategory?.title} desc={selectedCategory?.description} />
      </div>
      <div>
        <div className={styles.titleContainer}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryTitle} ${categoryId === category.id ? styles.activeCat : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.title}
            </div>
          ))}
        </div>
        <div className={styles.productsSection}>
          {shuffledProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;




// import Head from 'next/head'
// import shuffle from 'lodash.shuffle'
// import styles from '../styles/Home.module.css'
// import { postToShopify } from '../utils/shopify';
// import { categories } from './api/categories';
// import { Product, Header } from '@/components';
// import { useState } from 'react';



// export async function getServerSideProps() {
//   const result = await postToShopify({
//     query: `
//       query getCategoryList {
//         categories {
//           id
//           title
//           description
//           products {
//             id
//             title
//             imageSrc
//             imageAlt
//             price
//             variantId
//           }
//         }
//       }
//     `,
//     variables: {},
//   });

//   const categories = result?.data?.categories || [];

//   const url = new URL(process.env.URL || 'http://localhost:3000');
//   url.pathname = '/api/create-cart';

//   const cartRes = await fetch(url.toString());

//   if (!cartRes.ok) {
//     console.error(cartRes);
//     return { props: { categories: categories, cart: {} } };
//   }

//   const cartData = await cartRes.json();

//   return {
//     props: {
//       categories: categories,
//       cart: cartData,
//     },
//   };
// }



// export default function Home({ categories }) {

//   const [categoryId, setCategoryId] = useState(categories[0]?.id)

//   const handleCategoryClick = (categoryId) => {
//     setCategoryId(categoryId)
//   }

//   const selectedCategory = categories.find((category) => category.id === categoryId);

//   const shuffledProducts = shuffle(selectedCategory.products)

//   console.log(categoryId)

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>{selectedCategory?.title}</title>
//         <meta name="description" content={selectedCategory?.description} />
//       </Head>
//       <div>
//         <Header title={selectedCategory?.title} desc={selectedCategory?.description} />
//       </div>
//       <div>
//         <div className={styles.titleContainer}>
//           {categories?.map((category) => (
//             <div
//               key={category.id}
//               className={`${styles.categoryTitle} ${categoryId === category.id ? styles.activeCat : ''}`}
//               onClick={() => handleCategoryClick(category.id)}
//             >
//               {category.title}
//             </div>
//           ))}
//         </div>
//         <div className={styles.productsSection}>
//           {shuffledProducts.map((product) => (
//             <Product key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };