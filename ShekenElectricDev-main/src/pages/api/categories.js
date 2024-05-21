import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
    const data = await postToShopify({
        query: `
            query getAllCategories {
                collections(first: 100) {
                edges {
                    node {
                    id
                    title
                    descriptionHtml
                    image {
                        id
                        url
                        altText
                      }
                    products(first: 100) {
                        edges {
                        node {
                            id
                            title
                            description
                            handle
                            images(first: 1) {
                            edges {
                                node {
                                src
                                altText
                                }
                            }
                            }
                            variants(first: 1) {
                            edges {
                                node {
                                id
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
                }
                }
            }
        `,
        variables: {},
    });

    const categories = {};

    data.collections.edges.forEach(({ node }) => {
        if (node.products.edges.length > 0) {
            categories[node.id] = {
                id: node.id,
                title: node.title,
                categoryImg: node.image.url ?? '/placeholder-image.jpg',
                categoryImgAlt: node.image.altText ?? '',
                description: node.descriptionHtml,
                products: node.products.edges.map(({ node: product }) => ({
                    id: product.id,
                    variantId: product.variants.edges[0]?.node?.id,
                    title: product.title,
                    description: product.description,
                    imageSrc: product.images.edges[0]?.node?.src ?? '/placeholder-image.jpg',
                    imageAlt: product.images.edges[0]?.node?.altText ?? '',
                    price: product.variants.edges[0]?.node?.priceV2?.amount ?? 0,
                    slug: product.handle,
                })),
            };
        }
    });

    res.status(200).json(Object.values(categories))

}