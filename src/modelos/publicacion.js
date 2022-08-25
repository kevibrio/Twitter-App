const {Schema, model} = require('mongoose');

 const PostSchema = new Schema({
    titulo:     {type: String, required: true},
    descripcion:{type: String, required: true},
    img:        {type: String},
    fecha:      {type: String},
    tags: {
        tag:    {type: String}
    },
    likes:      [{users: {type: String}}],
    coments:    {type: Number},
    shares:     {type: Number},      
});

module.exports = model('Publicaciones',PostSchema);