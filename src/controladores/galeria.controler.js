'use strict'

const Galeria = require('../modelos/galeria');

const controller = {
    renderGaleria: async (req, res) => {
        const galeria = await Galeria.find().lean();
        res.render('app/galeria/all', {galeria});
    },

    renderCreateGaleria: (req, res) => {
        res.render('app/galeria/create');
    },

    renderEditGaleria: async (req,res) => {
        const galeria = await Galeria.findById(req.params.id).lean();
        res.render('app/galeria/edit',{galeria});
    
    },

    createGaleria: async (req, res) => {
        const errors = [];
        const {codigo,nombre,descripcion} = req.body;

        if(codigo.length < 4){
            errors.push({text: 'Código es muy corto, debe de tener minimo 4 caracteres'});
        }

        if(nombre.length < 5){
            errors.push({text: 'Nombre es muy corto, debe de tener minimo 5 caracteres'});
        }

        const imagen = await Galeria.findOne({nombre: nombre}).lean();
        if(imagen){
            errors.push({text: 'Ya existe la imagen en la galeria'});
        }

        if(errors.length >0){
            res.redirect('/galeria',{errors});
        }else{
            
            const puesto=new Galeria();
            puesto.nombre = nombre;
            puesto.descripcion = descripcion;
            puesto.codigo = codigo;

            if(req.file){
                puesto.img = 'uploads/' + req.file.filename;
            }
            
            await puesto.save();
            req.flash('success_msg','La imagen ha sido agregada con exito');
            res.redirect('/galeria');
            
        }
    },

    editGaleria: async (req, res) => {
        const puesto = req.body;

        if(req.file){
            puesto.img = 'uploads/' + req.file.filename;
        }
        
        await Galeria.findByIdAndUpdate(req.params.id, puesto);
        req.flash('success_updated','Se ha actualizado de manera exitosa');
        res.redirect('/galeria');
    },

    deleteGaleria: async (req, res) => {
        await Galeria.findByIdAndDelete(req.params.id);
        req.flash('success_deleted','Se ha eliminado de manera exitosa');
        res.redirect('/galeria');
    },

    //USERS MOVIL
    getGaleria: async (req, res) => {
        const img = await Galeria.find();
        return res.status(200).send({
            STATUS: 'OK',
            MESSAGE: 'Show products',
            IMG: img
        });
    },
};

module.exports = controller;