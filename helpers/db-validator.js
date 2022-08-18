const { Account } = require('../models');

//Validar si una cuenta existe en la DB por id-- validador personalizado
const accountExistingId = async(id = '') => {
    
    const accountExisting = await Account.findById(id);
    if ( !accountExisting ){
        throw new Error(`The account with id: ${id} was not found`);
    }

}

//Validar si un número de cuenta ya está asignada
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

const nonZero = async(amount = '') => {
    if (amount === 0) {
        throw new Error(`the amount must be greater than zero`);
    }
}

const balanceValidator = async([account_number = '', amount = '']) => {
    
    const account = await Account.findOne({ account_number: account_number });
    
    if (amount > account.balance) {
        throw new Error(`Insufficient account balance`);
    }

}

module.exports = {
    accountExistingId,
    accountValidator,
    accountNumberExists,
    balanceValidator,
    nonZero
}