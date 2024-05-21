// import { postToShopify } from '../../utils/shopify';


// export default async function handler(_req, res) {

//     //IMPOTRANT!

//     // eather nextjs or postman do some buggy shit and retrun the id with gid:/ instead of gid://
//     // check here if cartId returns something else throught our own api, slice would needed to be altere

//     const { cartId } = _req.query
    
//     const cartNum = cartId.slice(18)
//     const  realCartId  = `gid://shopify/Cart/${cartNum}`

// // 
//     // console.log ( realCartId )
//     // console.log(cartNum)


//     const data = await postToShopify({
//         query: `
//         query GetCart($realCartId: ID!) {
//           cart(id: $realCartId) {
//             checkoutUrl
//             estimatedCost {
//               totalAmount {
//                 amount
//               }
//             }
//             lines(first: 100) {
//               edges {
//                 node {
//                   id
//                   quantity
//                   estimatedCost {
//                     subtotalAmount {
//                       amount
//                       currencyCode
//                     }
//                     totalAmount {
//                       amount
//                       currencyCode
//                     }
//                   }
//                   merchandise {
//                     ... on ProductVariant {
//                       id
//                       title
//                       product {
//                         title

//                        	images(first: 1) {
//                 					edges {
//                   					node {
//                     					url
//                     					altText
//                               }
//                             }
//                           }
//                       }
//                       priceV2 {
//                         amount
//                         currencyCode
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//         `,
//         variables: { realCartId },
//       });

//       // console.log('hello there',data)
//       // hello there { cart: null }

//       // console.log('hello there2',realCartId)
//       // hello there2 gid://shopify/Cart/c1-0d5cd165a24eafb7334134ede2edf1cd
    
//     res.status(200).json({ body: data, query: cartId});
    
// }





// /*
//       query GetCart($cartId: ID!) {
//         cart(id: $cartId) {
//           checkoutUrl
//           estimatedCost {
//             totalAmount {
//               amount
//             }
//           }
//           lines(first: 100) {
//             edges {
//               node {
//                 quantity
//                 estimatedCost {
//                   subtotalAmount {
//                     amount
//                     currencyCode
//                   }
//                   totalAmount {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 merchandise {
//                   ... on ProductVariant {
//                     title
//                     product {
//                       title
//                     }
//                     priceV2 {
//                       amount
//                       currencyCode
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
// */






import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
    const { cartId } = _req.query;

    // Extract the correct cartNum value
    const cartNum = cartId.split('gid://shopify/Cart/')[1];

    // Construct the realCartId using the extracted cartNum
    const realCartId = `gid://shopify/Cart/${cartNum}`;

    const data = await postToShopify({
        query: `
        query GetCart($realCartId: ID!) {
          cart(id: $realCartId) {
            checkoutUrl
            estimatedCost {
              totalAmount {
                amount
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  estimatedCost {
                    subtotalAmount {
                      amount
                      currencyCode
                    }
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                              altText
                            }
                          }
                        }
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: { realCartId },
    });

    res.status(200).json({ body: data, query: cartId });
}
