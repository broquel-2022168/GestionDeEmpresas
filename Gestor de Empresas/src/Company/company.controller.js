'use strict'

import Company from './company.model.js'
import Category from '../category/category.model.js'
import ExcelJS from 'exceljs'

export const saveCompany = async(req,res) =>{
    try {
        let data = req.body
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message: 'Category not found'})
        if(!Company.schema.path('impacto').enumValues.includes(data.impacto)){
            return res.status(404).send({message: 'You must set an existing impact level, ALTO, MEDIO o BAJO'})
        }
        let company = new Company(data)
        await company.save()
        return res.send({message: 'Company saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving company'})
    }
}

export const getA_Z = async(req, res)=>{
    try {
        let companies = await Company.find()
        if(companies.length === 0) return res.status(404).send({message: 'Not found'})
        companies.sort((a, b) => a.name.localeCompare(b.name))
        return res.send({ companies })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting companies, order by A-Z'})
    }
}

export const getZ_A = async(req, res)=>{
    try {
        let companies = await Company.find()
        if(companies.length === 0) return res.status(404).send({message: 'Not found'})
        companies.sort((a, b) => b.name.localeCompare(a.name))
        return res.send({ companies })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting companies, order by Z-A'})
    }
}

export const get_C = async(req, res)=>{
    try {
        let companies = await Company.find().populate('category').exec();
        if(!companies) return res.status(404).send({message: 'Companies not found'})
        companies.sort((a, b) => a.category.name.localeCompare(b.category.name));
        return res.send({companies})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting companies by categories'})
    }
}

export const updateCom = async(req, res)=>{
    try {
        let { id  } = req.params
        let data = req.body
        let company = await Company.findById(id)
        if(!company){
            return res.status(404).send({message: 'Company not found'})
        }
        let updateCompany = await Company.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )

        return res.send({message: 'Company update successfully', updateCompany})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating category'})
    }
}



export const generateExcell = async (req, res) => {
    try {
        const companies = await Company.find().populate('category').exec();

        // Crear un nuevo workbook de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Empresas');

        // Definir las columnas en el worksheet
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Impacto', key: 'impacto', width: 10 },
            { header: 'Trayectoria', key: 'trayectoria', width: 20 },
            { header: 'Categoría', key: 'categoria', width: 20 },
        ];

        // Agregar los datos de las empresas al worksheet
        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                impacto: company.impacto,
                trayectoria: company.trayectoria,
                categoria: company.category.name 
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="empresas.xlsx"');
        console.log('Escribiendo archivo de Excel...');
        await workbook.xlsx.write(res);
        
        console.log('Documento de Excel generado con éxito.');

        return res.end();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al generar el documento de Excel' });
    }
};
