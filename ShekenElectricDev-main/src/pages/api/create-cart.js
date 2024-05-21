import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
    const data = await postToShopify({
        
        query: `
          mutation CreateCart {
              cartCreate {
                cart {                
                  id
                  checkoutUrl
                }
              }
            }
          `,
        variables: {},
      });

      
    res.status(200).json({
      cartId: data?.cartCreate?.cart?.id,
      checkoutUrl: data.cartCreate?.cart?.checkoutUrl,
      
    });
    // work
    // console.log("data from create data",data)
    
    // data from create data {
    //   cartCreate: {
    //     cart: {
    //       id: 'gid://shopify/Cart/Z2NwLWV1cm9wZS13ZXN0MTowMUhXQlQ3MUtYNkRQTjYwTldDUk0zRzFTRg',
    //       checkoutUrl: 'https://mateenim.myshopify.com/cart/c/Z2NwLWV1cm9wZS13ZXN0MTowMUhXQlQ3MUtYNkRQTjYwTldDUk0zRzFTRg?key=1c29d950caf30a8faeb39292acf40471'
    //     }
    //   }
    // }

}