import { postToShopify } from '../../utils/shopify';

/*
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      # Cart fields
    }
    userErrors {
      field
      message
    }
  }
}

*/

export default async function handler(_req, res) {

    // create event to trigger cart state to open!

    console.log(_req.query)


    const { cartId, variantId, itemQt } =  _req.query

     const cartNum = cartId.slice(18)
     const  realCartId  = `gid://shopify/Cart/${cartNum}`

     const ProductNum = variantId.slice(22)
     const  realProductId  = `gid://shopify/CartLine/${ProductNum}`

     

     const itemQtNum = parseInt(itemQt)

    console.log(cartId, variantId)
    console.log(realCartId, realProductId)


    const data = await postToShopify({
        query: `
        mutation UpdateCart($cartId: ID!, $variantId: ID!, $itemQtNum: Int) {
            cartLinesUpdate(cartId: $cartId, lines: {id:$variantId, quantity: $itemQtNum } ){
                cart  {
                    lines(first: 100) {
                        edges {
                            node {
                            id
                            quantity
                        
                        }
                    }
                }
            }        
        }
    }
        `,
        variables: { cartId, variantId, itemQtNum },
    })

    console.log(data)
    
    res.status(200).json(data);

}