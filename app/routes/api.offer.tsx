import {  json } from "@remix-run/node";
import  type {  ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getRecomendedOffers } from "../offer.server";


export const loader:LoaderFunction = async ({ request }) => {
  await authenticate.public.checkout(request);

};

//TODO The action responds to the POST request from the extension

export const action:ActionFunction = async ({ request }) => {
  const { cors,sessionToken }:any = await authenticate.public.checkout(request); 
  //  const { cors , sessionToken}:any = await authenticate.public.checkout(request);  
  // const offers = await getOffers(sessionToken?.input_data?.shop?.domain);
  const recomendedoffers = await getRecomendedOffers(sessionToken?.input_data?.shop?.domain,"gid://shopify/Product/9085500457235");
  console.log(recomendedoffers);
  return cors(json({ recomendedoffers }));
};
