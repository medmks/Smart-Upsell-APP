import { Button,Text,BlockStack,Grid,Divider,Layout,Card,InlineGrid } from "@shopify/polaris";

import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";

function Settings() {
  const [enablePrePurchase, setEnablePrePurchase] = useState(false);

  useEffect(() => {
    //TODO: Fetch the current settings from your backend
    //TODO: and update the state accordingly
    //TODO: Example: fetchSettings().then((settings) => setEnablePrePurchase(settings.enablePrePurchase));
  }, []);

  const fetchSettings = async () => {
    //TODO: Implement logic to fetch settings from your backend
    //TODO: Example: const response = await fetch('https:your-backend.com/settings');
    //TODO: const settings = await response.json();
    //TODO: return settings;
  };
  
  const updateSettings = async (newSettings:number) => {
    // TODO: Implement logic to update settings on your backend
    // Example: await fetch('https://your-backend.com/settings', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newSettings),
    // });
  };

  const handleToggleChange = () => {
    // Update the state locally
    setEnablePrePurchase(!enablePrePurchase);

    // Update the settings on your backend
    // Example: updateSettings({ enablePrePurchase: !enablePrePurchase });
  };

  return (
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
                      <Button variant="primary" onClick={()=>handleToggleChange()}>{enablePrePurchase ? "Desable":"Enable"}</Button>
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
                      <Button variant="primary" onClick={()=>handleToggleChange()}>{enablePrePurchase ? "Desable":"Enable"}</Button>
                  </InlineGrid>
                  <Text as="p" variant="bodyMd">
                  Disable and enable Post purchase extension for upsell and fix Add your favorite products
                  </Text>
                </BlockStack>
              </Card>
          </Grid.Cell>


        </Grid>
     

      
      </Layout.Section>
  </Layout>

    // <LegacyCard>
    //         <BlockStack gap="500">


    // <div className="">
    // <Text variant="heading3xl" as="h2">
    //     Online store dashboard
    //   </Text>  
    //     <label>
    //     Enable Pre-Purchase Extension
    //   </label>
    //   <Button variant="primary" onClick={()=>handleToggleChange()}>{enablePrePurchase ? "Desable":"Enable"}</Button>

    //   <Outlet />
    // </div>
    // </BlockStack>
    // </LegacyCard>

  );
}

export default Settings;
