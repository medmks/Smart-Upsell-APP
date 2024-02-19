import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { PrePurchaseStatus } from "~/models/settings.server";


export const loader:LoaderFunction = async ({ request, context }:LoaderFunctionArgs) => {
 
  await authenticate.public.checkout(request);
  const { cors,sessionToken } = await authenticate.public.checkout(request);

const Settings= await PrePurchaseStatus(sessionToken.dest)
  return cors(json(Settings));
};

