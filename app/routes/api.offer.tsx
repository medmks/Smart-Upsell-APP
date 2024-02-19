import {  json } from "@remix-run/node";
import  type {  ActionFunction, LoaderFunction } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import { getOffers } from "../offer.server";

// The loader responds to preflight requests from Shopify
export const loader:LoaderFunction = async ({ request }) => {
  await authenticate.public.checkout(request);
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action:ActionFunction = async ({ request }) => {
   const { cors,sessionToken }:any = await authenticate.public.checkout(request);   
   const offers = await getOffers(sessionToken?.input_data?.shop?.domain);
  return cors(json({ offers }));
};
