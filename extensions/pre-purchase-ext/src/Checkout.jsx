import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useApi,
  useSettings,
  
} from "@shopify/ui-extensions-react/checkout";


export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {

  const { query, i18n, sessionToken} = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [show, setShow] = useState(false);
  const [recomendedproducts, setrecomendedproducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);
  const lines = useCartLines();
  const settings = useSettings();
  const TitleExtension = settings.Extension_title;
  const Limit = settings.Extension_limit;
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.product.id);
  

 
  useEffect(() => {
    async function FetchTheRecommendedProduct(productId) {
      setLoading(true) 
      try{
        const  {data}  = await query(
          `query productRecommendations($productId: ID!) {
            productRecommendations(productId: $productId) {
              id
              title
              featuredImage{
                url
              }
              priceRange{
                maxVariantPrice{
                  amount
                }
              }
            }
          }`,
          {
            variables: { productId: productId},
          }
        );
        // setrecomendedproducts(data.productRecommendations)
        const recomendedproductsLimited =   data.productRecommendations.slice(0,Limit);
        setrecomendedproducts(recomendedproductsLimited)
        return data
      }catch(error){
        console.log(error);
      }finally{
       setLoading(false) 
      }
      
    }
    async function queryApi() {
      const token = await sessionToken.get();
      const {PrePurchaseEnabled} = await FetchfromApisettings(token);
      if(PrePurchaseEnabled == false ){
          console.log("no rendering");
          return null
      }
      setShow(true)
      const ProductInCart = cartLineProductVariantIds[0].toString()
      // const {productRecommendations} =
       await FetchTheRecommendedProduct(ProductInCart);
    }

  queryApi();

  }, []);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);
  async function FetchfromApisettings(token) {
    const res = fetch(
        'https://partition-wiley-butter-extreme.trycloudflare.com/api/settings',
        {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ).then((res)=>{
        return res.json()
      })
      .then((data)=>{
        return data
      })
    return res
}
  async function handleAddToCart(variantId) {

      setAdding(true);
      const  {data}  = await query(` 
      query ($variantId:ID!) {
        product(id: $variantId) {
          variants(first:1){
            nodes{
              id
            }
          }
        }
      }
      `,{
        variables: { variantId: variantId},
      });


      const { id } = data.product.variants.nodes[0];

      const result = await applyCartLinesChange({
        type: 'addCartLine',
        merchandiseId: id,
        quantity: 1,
      });
      setAdding(false);
      if (result.type === 'error') {
        setShowError(true);
        console.error(result.message);
      }
    }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && recomendedproducts.length === 0 ) {
    return null;
  }
  const RecomendedOnOffer = getRecomendedproductsOnOffer(lines, recomendedproducts);

  if (!RecomendedOnOffer.length || show === false) {
    return null;
  }

  return (
 (
    <ProductRecomandation
      product={RecomendedOnOffer[0]}
      i18n={i18n}
      adding={adding}
      handleAddToCart={handleAddToCart}
      showError={showError}
      TitleExtension={TitleExtension}
    />
  )
  );
}

function LoadingSkeleton() {
  return (
    <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <SkeletonImage aspectRatio={1} />
          <BlockStack spacing='none'>
            <SkeletonText inlineSize='large' />
            <SkeletonText inlineSize='small' />
          </BlockStack>
          <Button kind='secondary' disabled={true}>
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
    </BlockStack>
  );
}


function getRecomendedproductsOnOffer(lines, products) {

  const cartLineProductVariantIds = lines.map((item) => item.merchandise.product.id);
  return products.filter((product) => {
    const isProductVariantInCart = [product].some(({ id }) => cartLineProductVariantIds.includes(id) );
    return !isProductVariantInCart;
  });
}
function ProductRecomandation({ product, i18n, adding, handleAddToCart, showError,TitleExtension }) {
  const { featuredImage, title, priceRange, id } = product;
  const renderPrice = i18n.formatCurrency(priceRange.maxVariantPrice.amount
    );
    const imageUrl =
    featuredImage.url ??
    'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';
    
    return (
      <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>{TitleExtension ? TitleExtension:" You might also like" }  </Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
          >
          <Image
            border='base'
            borderWidth='base'
            borderRadius='loose'
            source={imageUrl}
            description={title}
            aspectRatio={1}
            />
          <BlockStack spacing='none'>
            <Text size='medium' emphasis='strong'>
              {title}
            </Text>
            <Text appearance='subdued'>{renderPrice}</Text>
          </BlockStack>
          <Button
            kind='secondary'
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={() => handleAddToCart(id.toString())}
            >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && <ErrorBanner />}
    </BlockStack>
  );
}

function ErrorBanner() {
  return (
    <Banner status='critical'>
      There was an issue adding this product. Please try again.
    </Banner>
  );
}


