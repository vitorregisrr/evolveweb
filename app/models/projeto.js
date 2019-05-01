const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAutoIncrement = require('mongoose-auto-increment');
const mongoURI = require('../util/mongo_URI');
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

const Projeto = new Schema({
    codigo: {
        type: Number
    },

    titulo: {
        type: String,
        required: false
    },

    descricao: {
        type: String,
        required: false
    },

    categoria: {
        type: String,
        required: false
    },

    link: {
        type: String,
        required: false
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    
    image: {
        type: Object,
        required: false
    },

    images: {
        type: Array,
        required: false
    },
    
    destaque:{
        type: Boolean,
        required: false
    },

    ano:{
        type: String,
        required: false
    },

    date:{
        type: Date,
        default: Date.now(),
        required: false
    },

});

mongooseAutoIncrement.initialize(connection, {
    useNewUrlParser: true
});

Projeto.plugin(mongooseAutoIncrement.plugin, {
    model: 'Projeto',
    field: 'codigo',
    startAt: 100,
    incrementBy: 4
});
module.exports = mongoose.model('Projeto', Projeto);