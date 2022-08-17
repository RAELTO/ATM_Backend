const { Schema, model } = require('mongoose');

const AccountSchema = Schema({

    account_number: {
        type: String,
        required: [true, 'The account number is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    client_doc: {
        type: String,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
    client_lastName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },

});

AccountSchema.methods.toJSON = function(){
    const { __v, pin, _id, ...account } = this.toObject();/*genera la instancia como objeto literal de JS y saca 
    el __v y el pin y almacena el resto en account*/

    account.uid = _id; //muestra el _id como uid en las res, (_id se extrae previamente)

    return account;
}

module.exports = model( 'Account', AccountSchema );