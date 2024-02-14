import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";




export const loader = async ({ request }:LoaderFunctionArgs) => {
  
  // await authenticate.public.checkout(request);
// 
  const corsHeaders = {
  'Access-Control-Allow-Origin': ' https://apr-wright-intervention-words.trycloudflare.com/api/settings',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

  const { cors } = await authenticate.public.checkout(request);

  if (request.method === 'OPTIONS') {
    return json({
      status: 200,
      headers: corsHeaders,
      body: ''
    });
  }


  return cors(json({hello:"Settings"})) 
};

// export const action = async ({ request }: ActionFunctionArgs) => {

//   await authenticate.public.checkout(request);
//   const { cors } = await  authenticate.public.checkout(request);

//   if (request.method === 'OPTIONS') {
//     return json({
//       status: 200,
//       headers: "corsHeaders",
//       body: ''
//     });
//   }


//   return cors(json({hello:"this is from action "}))
// };
