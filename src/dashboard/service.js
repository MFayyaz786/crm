const superAdminUserModel=require("../superAdminPanelUser/model");
const planModel=require("../plan/model");
const serviceProviderModel=require("../serviceProvider/model")
const service={
    states:async()=>{
   const users=await superAdminUserModel.countDocuments({active:true});
   const sp = await planModel.countDocuments({active:true});
   const plans=await serviceProviderModel.countDocuments({active:true});
   return {totalUser:users,companies:sp,plans:plans}
    }
}
module.exports=service