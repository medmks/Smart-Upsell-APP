import { Button,Text,BlockStack,Grid,Layout,Card,InlineGrid, PageActions, Page, 
  Badge,
  FullscreenBar,
   } from "@shopify/polaris";
import { Form,  useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticate} from "~/shopify.server";
import db from "../db.server"
import { useState ,useCallback} from "react";
import { getsettingsbyId } from "~/models/settings.server";  


export type LoaderDataprops = {
  PrePurchaseEnabled:boolean
  PostPurchaseEnabled:boolean
}

export const loader:LoaderFunction = async ({ request, params }) =>{
   await authenticate.admin(request);
   const { session } = await authenticate.admin(request);    
   const { id } = session;
   const ExtensionSettings = await getsettingsbyId(id);
  return ExtensionSettings;
}

//REVIEW: ActionFunction triggered the action when posting data  
export const action:ActionFunction = async ({request}) =>{

  const { session } = await authenticate.admin(request);    
  const { id } = session
  const data = {
        ...Object.fromEntries(await request.formData()),
      };
  const isPreEnable  = data.PrePurchaseEnabled == "true";
  const isPostEnable  = data.PostPurchaseEnabled == "true" 
  const updatedSession = await db.session.update({
    where: { id: id },
    data: { 
     PrePurchaseEnabled: isPreEnable,
     PostPurchaseEnabled: isPostEnable,
},
});
    console.log("updated",updatedSession)
    return null
}

function Settings() {


  const extensionState:LoaderDataprops =  useLoaderData();
  const ExSettings = extensionState;
  const handleActionClick = useCallback(() => {
    return ;
  }, []);

  const FullscreenBarMarkup =  () => {
    return(
      <FullscreenBar onAction={handleActionClick}>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
      {ismessed && ismessedpost ? null  : <Badge tone="info">Draft</Badge> }
       
        <div style={{marginLeft: '1rem', flexGrow: 1}}>
          <Text variant="headingLg" as="p">
            Extension Settings
          </Text>
        </div>
        <PageActions
  primaryAction={{
    content: "Save the Changes",
    loading: isSaving,
    disabled: ismessed && ismessedpost,
    onAction: handleSave,
  }}
/>
      </div>
  </FullscreenBar>
    )

}


  const [prepurchaseenable,setprepurchaseenable] = useState(ExSettings.PrePurchaseEnabled);
  const [PostPurchaseEnabled,setPostPurchaseEnabled] = useState(ExSettings.PostPurchaseEnabled);
  const [CleanBoolean,setCleanBoolean] = useState(!ExSettings.PrePurchaseEnabled);
  const [CleanPostBoolean,setCleanPostBoolean] = useState(!ExSettings.PostPurchaseEnabled);
  const ismessed = JSON.stringify(prepurchaseenable) !== JSON.stringify(CleanBoolean);
  const ismessedpost = JSON.stringify(PostPurchaseEnabled) !== JSON.stringify(CleanPostBoolean);
  const nav = useNavigation();
  const isSaving = nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const submit = useSubmit();

  //TODO: save the data 
  function handleSave() {
    const data = {
      PrePurchaseEnabled:  Boolean(prepurchaseenable),
      PostPurchaseEnabled:  Boolean(PostPurchaseEnabled)
    };
    
    setCleanBoolean(!prepurchaseenable);
    setCleanPostBoolean(!PostPurchaseEnabled)
    submit(data, { method: "post" });
  }
 const handelsetPrepoststate =  ()=>{

  setprepurchaseenable(!prepurchaseenable);
  }
 const handelsetpoststate =  ()=> {
  setPostPurchaseEnabled(!PostPurchaseEnabled);
}

  return (
    <Page>
    <Layout>
      <Layout.Section>
      <div style={{height: '120px', width: '100%'}}>
        <FullscreenBarMarkup  />
      <div style={{padding: '1rem'}}>

        <Text variant="headingLg" as="p">
          Enable and Disable 
        </Text>
      </div>
    </div>
        <Grid>

          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Pre purchase extension
                    </Text>
                    <Form method="post">     
                          <Button onClick={()=> {handelsetPrepoststate()}} variant="secondary">{prepurchaseenable?"Disable":"Enable"}</Button>
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
                          <Button onClick={()=>{handelsetpoststate()}} variant="secondary">{PostPurchaseEnabled?"Disable":"Enable" }</Button>
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

{/* <PageActions
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
    disabled: ismessed && ismessedpost,
    onAction: handleSave,
  }}
/> */}

</Layout.Section>
  </Layout>


  </Page>
  );

}

export default Settings;
