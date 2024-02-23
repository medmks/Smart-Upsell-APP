// import { ApiVersion } from "@shopify/shopify-api";
import db from "./db.server";
const OFFERS = [
          {
            id: 1,
            title: "One time offer",
            productTitle: "The S-Series Snowboard",
            productImageURL:
              "https://cdn.shopify.com/s/files/1/0", // Replace this with the product image's URL.
            productDescription: ["This PREMIUM snowboard is so SUPER DUPER awesome!"],
            originalPrice: "699.95",
            discountedPrice: "699.95",
            changes: [
              {
                type: "add_variant",
                variantID: 123456789, // Replace with the variant ID.
                quantity: 1,
                discount: {
                  value: 15,
                  valueType: "percentage",
                  title: "15% off",
                },
              },
            ],
          },
        ];
const query =`
        {
                 products(first: 1) {
                   edges {
                     node {
                       id
                       legacyResourceId
                       title
                       featuredImage {
                         url
                       }
                       description
                       variants(first: 1) {
                         edges {
                           node {
                             price
                             compareAtPrice
                             id
                             legacyResourceId
                           }
                         }
                       }
                     }
                   }
                 }

          }`;


async function getAccessToken(shop:string) {
    const session = await db.session.findFirst({
      where:{
              shop:shop
                    },
                    orderBy: {
                    expires: 'desc',
                    },
                })  
          
                return session ? session.accessToken : null;    
              };


export async function getRecomendedOffers(shop:string,ID:string) {
  const qr = 
   `#graphql
      query {
        productRecommendations(productId: "gid://shopify/Product/9085500457235") {
          title
        }
      }`;

  const QueryRecomended = `
      query {
        productRecommendations(productId: "gid://shopify/Product/9085500457235") {
          id
        }
      }`;
    
  const AccessToken =  await getAccessToken(shop);

  try{

    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
     method: "POST",
      headers: {
      "Content-Type": "application/graphql",
       "X-Shopify-Access-Token": AccessToken!
        },
                body: QueryRecomended
                    });
                if(response.ok){
                  const data = await response.json()
                        return data
                    }
                } catch(err){
                    console.log(err)
                }  

  return OFFERS;


  // const { storefront }:any = await unauthenticated.storefront(
  //   'my-upsell-store.myshopify.com'
  // );
  // const response = await storefront.graphql(
  //   `#graphql
  //   query productRecommendations($productId: ID!) {
  //     productRecommendations(productId: $productId) {
  //       id
  //     }
  //   }`,
  //   {
  //     variables: { productId: productId},
  //   }
  // );
  // const data = await response.json();


}






export async function getOffers(shop:string) {
const AccessToken =  await getAccessToken(shop)
  try{
    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
     method: "POST",
      headers: {
      "Content-Type": "application/graphql",
       "X-Shopify-Access-Token": AccessToken!
                        },
                body: query
                    });
                if(response.ok){
                  const data = await response.json()
                  const {
                    data: {
                    products: { edges }  
                            }
                        } = data;
                        return edges
                    }
                  return null
            
                } catch(err){
                    console.log(err)
                }  
                
          return OFFERS;
        }
 
export function getSelectedOffer(offerId:any) {
          return OFFERS.find((offer) => offer.id === offerId);
        };

