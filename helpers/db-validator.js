const { Account } = require('../models');

//Validar si una cuenta existe en la DB por id-- validador personalizado
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

//Validar si una cuenta existe en la DB por numero de cuenta-- validador personalizado
const accountNumberExists = async(account_number = '') => {
    
    const accountExisting = await Account.findOne({ account_number });
    if ( !accountExisting ){
        throw new Error(`The account number: ${account_number} was not found`);
    }

}

module.exports = {
    accountExistingId,
    accountValidator,
    accountNumberExists,
}