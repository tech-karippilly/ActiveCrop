import mongoose from 'mongoose';
import {Role} from '../../models/index.js'

async function createRole(req,res){
    try{
        const {roleName, description} = req.body

        const existingRole  = await Role.findOne({roleName})         

        if(existingRole){
            return res.status(400).json({message:"Role Already exists "});         
        }

        const newRole = new Role({roleName,description});
        await newRole.save();

        res.status(201).json({message:"Role Created Successfully" ,role:newRole});
    }catch(error){
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getRole(req,res){
    try{

        const roles = await Role.find()
        res.status(200).json({message:"Roles" ,role:roles});

    }catch(error){
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteRole(req,res){
    const {id}  =req.params
    try{

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid role ID' });
          }
          const role = await Role.findById(id);

          if (!role) {
            return res.status(404).json({ message: 'Role not found' });
          }
          
          await Role.findByIdAndDelete(id);
          res.status(200).json({ message: 'Role deleted successfully' });
    }catch(error){
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export{
    createRole,
    getRole,
    deleteRole
}