const PostCtrl = {};

const post= require('../modelos/publicacion');


//verificar
PostCtrl.createPost = async (req,res) => {
    const errors = [];
    const {titulo,descripcion, tags} = req.body;
    if(titulo.length < 10){
        errors.push({text: 'Titulo es muy corto, debe de tener minimo 10 caracteres'});
    }

    if(descripcion.length < 10){
        errors.push({text: 'La Descripcion es muy corta, debe de tener minimo 40 caracteres'});
    }

            const new_post=new post();
            

            new_post.titulo = titulo;
            new_post.descripcion = descripcion;
            if(req.file){
                new_post.img = 'uploads/' + req.file.filename;
            }

            var f = new Date();
            new_post.fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
            new_post.tags = tags.split(" ");
            new_post.likes= [];
            new_post.coments = 0;
            new_post.shares = 0;   

            await new_post.save();
            res.status(200).send({ STATUS: 200, MESSAGE: 'La publicación ha sido creada correctamente' });

};


PostCtrl.getPublicaciones = async (req,res) =>{
    const publicacionesGeneral = await post.find();
        return await res.status(200).send({
            STATUS: 'OK',
            MESSAGE: 'Show posts',
            productos: publicacionesGeneral
        });
}
PostCtrl.putShares = async (req, res) =>{
    const {titulo} = req.body;
    const updateDocument = {
        $inc: {shares: 1}
    }
    const query = {titulo: titulo}
    const publicacion = await post.updateOne(query, updateDocument)
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: '¡Se ha dado like a una publicacion!',
        publicacion: publicacion
    });
}

PostCtrl.putLikes = async (req, res) =>{
    const {titulo, correo} = req.body;
    const updateDocument = {
        $push: {"likes": {"users": correo}}
    }
    const query = {titulo: titulo}
    const publicacion = await post.updateOne(query, updateDocument)
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: '¡Se ha dado like a una publicacion!',
        publicacion: publicacion
    });
}

PostCtrl.getAllLikes = async (req,res) =>{
    const {correo} = req.body;
    const query = {"likes": {$elemMatch:{"users": correo}}}
    const publicacion =  await post.find(query)
    console.log(publicacion)
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: 'Obtener likeados',
        publicacion: publicacion
    })
}

PostCtrl.ordenados = async (req,res) =>{
    const publicacion = await post.aggregate([{
        $addFields: {likes_count: {$size: "$likes"}}
    }, {$sort: {likes_count: -1}}])
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: 'Se ha obtenido las publicaciones',
        publicacion: publicacion
    });
}

PostCtrl.getNotLikes = async (req,res) =>{
    const {correo} = req.body;
    const query = {"likes": {$not: {$elemMatch: {"users": correo}}}}
    const publicacion =  await post.find(query)
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: 'Obtener not likeados',
        publicacion: publicacion
    })
}

PostCtrl.delLikes = async(req, res) =>{
    const {titulo, correo} = req.body;
    const updateDocument = {
        $pull: {"likes": {"users": correo}}
    }
    const query = {titulo: titulo}
    const publicacion = await post.updateOne(query, updateDocument)
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: '¡Se ha dado dado dislike a una publicacion!',
        publicacion: publicacion
    });
}

module.exports = PostCtrl;
