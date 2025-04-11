import mongoose from "mongoose";

const fileSchema = mongoose.Schema({
    fileName:{type:String,required:true},
    content:{type:String,required:true}
})
export const Userfile = mongoose.model('Userfile',fileSchema)
