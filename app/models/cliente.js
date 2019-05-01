const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cliente = new Schema({
    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: false
    },

    telefones: {
        type: Array,
        required: false
    },

    image: {
        type: Object,
        required: false
    },

    encarregado: {
        type: String,
        required: false
    },

    depoimento:{
        type: Schema.Types.ObjectId,
        ref: 'Depoimento'
    }

});

module.exports = mongoose.model('Cliente', Cliente);