const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Noticia = new Schema({
    titulo: {
        type: String,
        required: true
    },

    conteudo: {
        type: String,
        required: true
    },

    categoria: {
        type: String,
        default: 'Outros'
    },

    tags: {
        type: Array,
        required: false
    },


    image: {
        type: Object,
        required: false
    },
    
    date: {
        type: Date,
        default: Date.now()
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

});

module.exports = mongoose.model('Noticia', Noticia);