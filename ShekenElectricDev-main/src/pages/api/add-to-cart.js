import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
  try {
    const { cartId, variantId } = _req.query;

    if (!cartId || !variantId) {
      throw new Error('CartId or variantId is missing in the request.');
    }

    // Extract cartNum from cartId
    const cartNum = cartId.slice(19);
    const realCartId = `gid://shopify/Cart/${cartNum}`;

    // Extract ProductNum from variantId
    console.log(variantId,"variantId")
    const ProductNum = variantId.slice(21);
    console.log("ProductNum", ProductNum)
    const realProductId = `gid://shopify/ProductVariant/${ProductNum}`;

    // Call Shopify API to add product to cart
    const data = await postToShopify({
      query: `
        mutation AddToCart($realCartId: ID!, $realProductId: ID!) {
          cartLinesAdd(cartId: $realCartId, lines: [{ quantity: 1, merchandiseId: $realProductId}]) {
            cart {
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { realCartId, realProductId },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
