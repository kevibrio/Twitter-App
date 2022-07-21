const mongoose = require('mongoose');

const {HOST, PASS, DB} = process.env;

const URI = `mongodb+srv://ups:UPS123@cluster0.zzokk.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(db => console.log('Base de datos esta conectado'))
.catch(err => console.log(err));

