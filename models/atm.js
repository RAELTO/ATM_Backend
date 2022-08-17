const { Schema, model } = require('mongoose');

const AtmSchema = Schema({

    bill100: {
        type: Number,
        required: [true, 'The number of bill is required '],
       
    },
    bill50: {
        type: Number,
        required: [true, 'The number of bill is required '],
       
    },
    bill20: {
        type: Number,
        required: [true, 'The number of bill is required '],
       
    },
    bill10: {
        type: Number,
        required: [true, 'The number of bill is required '],
        
    },
    quantity: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
   
    

});

AtmSchema.methods.toJSON = function(){
    const { __v, ...Atm } = this.toObject();

    return Atm;
}

module.exports = model( 'atm', AtmSchema );