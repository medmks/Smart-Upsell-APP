import { Button,Text,BlockStack,Grid,Layout,Card,InlineGrid, PageActions, Page } from "@shopify/polaris";
import { Form,  useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticate} from "~/shopify.server";
import db from "../db.server"
import { useState } from "react";
import { getsettingsbyId } from "~/models/settings.server";  


export type LoaderDataprops = {
  PrePurchaseEnabled:boolean
  PostPurchaseEnabled:boolean
}

export const loader:LoaderFunction = async ({ request, params }) =>{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
   await authenticate.admin(request);
   
   const { session } = await authenticate.admin(request);    
   const { id } = session

   const ExtensionSettings = await getsettingsbyId(id);

  return ExtensionSettings
}

//REVIEW: ActionFunction triggered the action when posting data  
export const action:ActionFunction = async ({request}) =>{

  const { session } = await authenticate.admin(request);    
  const { id } = session
  const data = {
        ...Object.fromEntries(await request.formData()),
      };
  const isPreEnable  = data.PrePurchaseEnabled == "true";
  const isPostEnable  = data.PrePurchaseEnabled == "true" 
  const updatedSession = await db.session.update({
                              where: { id: id },
                              data: { 
                                PrePurchaseEnabled: isPreEnable,
                                PostPurchaseEnabled: isPostEnable,
                               },
                            });
       console.log(updatedSession)
    return null
}

function Settings() {

  const extensionState:LoaderDataprops =  useLoaderData();


  const ExSettings = extensionState;

  console.log(ExSettings);
  

  const [prepurchaseenable,setprepurchaseenable] = useState(ExSettings.PrePurchaseEnabled)
  const [PostPurchaseEnabled,setPostPurchaseEnabled] = useState(ExSettings.PostPurchaseEnabled)

  const [CleanFormState,setCleanFormState] = useState(false)
  const ismessed = JSON.stringify(prepurchaseenable) !== JSON.stringify(CleanFormState) || JSON.stringify(PostPurchaseEnabled) !== JSON.stringify(CleanFormState)  ;
  const nav = useNavigation();
  const isSaving = nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const submit = useSubmit();

  //TODO: save the data 
  function handleSave() {
    const data = {
      PrePurchaseEnabled:  Boolean(prepurchaseenable),
      PostPurchaseEnabled:  Boolean(PostPurchaseEnabled)
    };
    setCleanFormState(prepurchaseenable);
    submit(data, { method: "post" });
  }

  return (
    <Page>
      <ui-title-bar title={"Extension Settings"}>
          Enable / Disable  
      </ui-title-bar>
    <Layout>
      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Pre purchase extension
                    </Text>
                    <Form method="post">     
                          <Button onClick={()=> setprepurchaseenable(!prepurchaseenable)} variant="primary">{prepurchaseenable?"Disable":"Enable" }</Button>
                    </Form>
                  </InlineGrid>
                  <Text as="p" variant="bodyMd">
                    Disable and enable the Pre purchase extension for upsell and fix Add your favorite products
                  </Text>
                </BlockStack>
              </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Post purchase extension 
                    </Text>
                    <Form method="post">     
                          <Button onClick={()=> setPostPurchaseEnabled(!PostPurchaseEnabled)} variant="primary">{PostPurchaseEnabled?"Disable":"Enable" }</Button>
                    </Form>
                  </InlineGrid>
                  <Text as="p" variant="bodyMd">
                  Disable and enable Post purchase extension for upsell and fix Add your favorite products
                  </Text>
                </BlockStack>
              </Card>
          </Grid.Cell>
        </Grid>
      </Layout.Section>
      <Layout.Section>

<PageActions
  secondaryActions={[
    {
      content: "cancel",
      loading: false,
      disabled: true,
      destructive: true,
      outline: true,
      onAction: () =>
        submit({ action: "cancel" }, { method: "post" }),
    },
  ]}
  primaryAction={{
    content: "Save",
    loading: isSaving,
    disabled: !ismessed,
    onAction: handleSave,
  }}
/>

</Layout.Section>
  </Layout>


  </Page>
  );

}

export default Settings;
