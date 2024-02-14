
// import db from '../db.server'


// export async function PrePurchaseStatus(SessionId:any) {
//           try{
//                     const session = db.session.findUnique({
//                               where:{id: SessionId},
//                               select:{prePostStatus: true}
//                     })
//                     return session
//           }catch (error){
//                     console.log(error);
                    
//           }
// }

// export async function UpdatePrePurchaseStatus(SessionId:any,newValue:object) {
//           try {
//                     // Update the session in the database
//                     const updatedSession = await prisma.session.update({
//                       where: { id: SessionId },
//                       data: { prePostStatus: newValue },
//                     });
                
//                     // If the update is successful, return the updated session
//                     return updatedSession;
//                   } catch (error) {
//                     console.error('Error updating session:', error);
//                     throw error; // Handle the error appropriately
//                   } 
// }