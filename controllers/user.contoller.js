import mongoose from "mongoose";
import { Userfile } from "../models/file.model.js";

const dynamicFile = async (req,res)=>{
    
    
    const {fileName}=req.params;
    const existedFile = await Userfile.findOne({
        fileName
    }).select("-__v -_id")
    if(existedFile){
        console.log(`already exist ${existedFile}`);
        return res.status(200).json({statusCode:200,message:"user fetched succesfully",existedFile})
        console.log("afafaf");
        
    }
    const createUserFile = await Userfile.create({
        fileName,
        content:`new file created for ${fileName} `
    })
    if(createUserFile){
        console.log(`new file created ${createUserFile} `);
        const freshFile = await Userfile.findById(createUserFile._id).select('-__v -_id').lean();
        
        return res.status(200).json({statusCode:200,message:"user created succesfully",freshFile})
    }

}
const updateUserFile = async (req,res)=>{
    console.log("userfile-param",req.params);
    
    const {fileName}=req.params;
    const {content}=req.body;
    const existedFile = await Userfile.findOne({
        fileName
    })
    if(!existedFile){
        console.log("file do not exist");
        
return res.status(400).json({statusCode:400,message:"user file does not exist"})
    }
    if(existedFile){
        console.log(`already exist ${existedFile}`);

        existedFile.content = content ? content:"";
        
        await existedFile.save({ validateBeforeSave: false })
        return res.status(200).json({statusCode:200,message:"user file updated content succesfully",existedFile})
        
    }
}
export {dynamicFile, updateUserFile}
