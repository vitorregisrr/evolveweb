const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Depoimento = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },

    titulo: {
        type: String,
        required: false
    },

    descricao: {
        type: String,
        required: false
    },

    date:{
        type: Date,
        default: Date.now()
    },

    destaque:{
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('Depoimento', Depoimento);