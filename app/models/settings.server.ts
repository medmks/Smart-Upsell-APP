import db from '../db.server'

export async function PrePurchaseStatus(shop:string) {
          const getsettingsSession = await db.session.findFirst({
                    where: {
                      shop: shop,
                    },
                    orderBy: {
                    expires: 'desc',
                    },
                    select:{
                      PrePurchaseEnabled:true
                    }
                  });
          if(!getsettingsSession){
                    return null
          }
          return getsettingsSession

}

export async function getsettingsbyId(id:string) {
          const ExtensionStatus = await db.session.findFirst(
                {   
                  where: { id:id }, 
                  select:{
                    PostPurchaseEnabled:true,
                    PrePurchaseEnabled:true
                  }
                }
                    );
        
          if(!ExtensionStatus){
                    return null
          }
          const settings =  ExtensionStatus;

          return settings

}