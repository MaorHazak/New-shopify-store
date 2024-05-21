import { default as fetch } from 'node-fetch';
export const postToShopify = async ({ query, variables = {} }) => {
  try {
    const response = await fetch(process.env.SHOPIFY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.log({ errors: result.errors });
      throw new Error('Error in Shopify response');
    } else if (!result || !result.data) {
      console.log({ result });
      throw new Error('Empty response from Shopify');
    }

    return result.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error communicating with Shopify');
  }
};