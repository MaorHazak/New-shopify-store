// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
  const data = await postToShopify({
    query: `
      query getProductList {
        products(sortKey: PRICE, first: 100, reverse: true) {
          edges {
            node {
              id
              handle
              description
              descriptionHtml
              title
              totalInventory
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    quantityAvailable
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {},
  });

  res.status(200).json(data);
}