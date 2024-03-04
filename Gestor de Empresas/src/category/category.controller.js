'use strict'

import Category from './category.model.js'
import Company from '../Company/company.model.js'

export const saveC = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: 'Category saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error savedCategory'})
    }
}

export const getC = async(req, res)=>{
    try {
        let categories = await Category.find()
        if(categories.length === 0) return res.status(404).send({message: 'Categories not found'}) 
        return res.send({ categories })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting categories'})
    }
}

export const updateC = async(req, res) =>{
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send({message: 'Animal not found and not update'})
        return res.send({message: 'Category update successfully', updateCategory})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const deleteC = async(req, res) =>{
    try {
        let { id } =  req.params
        let category = await Category.findOne({_id: id})
        if(!category) return res.status(404).send({message: 'Category not found'})

        let defaultCategory = await Category.findOne({ name: 'Default' });
        if (!defaultCategory) {
            defaultCategory = await Category.create({ name: 'Default', description: 'Categoría por defecto' });
        }
 
        await Company.updateMany({ category: id }, { $set: { category: defaultCategory._id } });

        let deletedCategory = await Category.findOneAndDelete({_id: id})
        return res.send({message: `Category with data ${deletedCategory} deleted succesfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deletign category'})
    }
}