import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  Pressable,
  Heading,
  BlockSpacer,
  Divider,
  useCartLines,
  useApplyCartLinesChange,
  useSettings
} from '@shopify/ui-extensions-react/checkout';
import { Checkbox, InlineLayout, BlockStack,Text,Image } from '@shopify/ui-extensions/checkout';
import { useState,useEffect } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);
// const VariantId = "gid://shopify/ProductVariant/44219889451266"
const VariantId = "gid://shopify/ProductVariant/48100056498451"

function Extension() {


  const [loading, setLoading] = useState(false);
  const [isSelected,setisSelected] = useState(false)
  const settings= useSettings()
  //TODO: State for setting product variant
  const [variant, setvariant] = useState();
  const { query } = useApi();

  const Applycartlinechange= useApplyCartLinesChange();
  const cartline= useCartLines()
  // const VariantId = settings.selected_variant

  useEffect(() => {
    //TODO: Fetch and set the product
    async function fetchProducts() {
      setLoading(true);
      const queryResult= await query(`
      {
        node(id:"${VariantId}"){
... on ProductVariant{
title
price {
  amount
}
product {
     id
      title
featuredImage{
  url
}
}
}
        }
      }
      `)
       
if (queryResult) {
  console.log(queryResult);
  setvariant(queryResult.data.node);
}
       setLoading(false);
      }
    if(VariantId){

      fetchProducts();
    }
  }, []);
  useEffect(()=>{
    //TODO: interact with actions of the user Add or remove the product to/ from cartlist  
    if(isSelected){
      Applycartlinechange({
        type:"addCartLine",
        quantity:1,
        merchandiseId:VariantId,
      });
    }
    else{
      const cartLineId = cartline.find((CL)=>CL.merchandise.id=== VariantId)?.id
      if (cartLineId) {
        Applycartlinechange({
          type:"removeCartLine",
          id:cartLineId,
          quantity:1
        })
      }
    }
  },[isSelected])



if(!variant || !VariantId){
  return null
}


  return (
    <>
    <Divider/>
    <BlockSpacer spacing={"base"}/>
    <Heading level={2}>
      Products you may like
    </Heading>
    <BlockSpacer spacing={"base"}/>
    <Pressable onPress={()=>setisSelected(!isSelected)}>
    <InlineLayout
    blockAlignment="center"
    spacing={["base","base"]}
    columns={["auto", 80,"fill"]}
    padding="base"
    >
      <Checkbox
      checked={isSelected}
      />
      <Image
      source={variant.product.featuredImage.url || variant.product.featuredImage.url }
      borderRedius="base"
      border="base"
      borderWidth="base"
      />
      <BlockStack>
        <Text>
        {variant.product.title}
        </Text>
        <Text>
        {variant.price.amount} Dh
        </Text>
      </BlockStack>
    </InlineLayout>
    </Pressable>
    </>

  );
}