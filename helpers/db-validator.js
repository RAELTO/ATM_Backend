const { Account } = require('../models');

//Validar si un usuario existe en la DB -- validador personalizado
const accountExistingId = async(id = '') => {
    
    const accountExisting = await Account.findById(id);
    if ( !accountExisting ){
        throw new Error(`The account with id: ${id} was not found`);
    }

}

const accountValidator = async(account_number = '') => {
    
    const accountExists = await Account.findOne({ account_number });
    if ( accountExists ){
        throw new Error(`The account number: ${account_number}, is already in use`);
    }

}

module.exports = {
    accountExistingId,
    accountValidator
}