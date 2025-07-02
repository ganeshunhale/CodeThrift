import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   username:{type:String,required:true,unique:true} ,
   isAuth:{type:Boolean,required:true},
   password:{type:String}
},{
   timestamps:true
})

export const User = model('User',userSchema)