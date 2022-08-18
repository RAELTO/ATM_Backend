const { response } = require("express");

const bcryptjs = require('bcryptjs');

const { Account } = require("../models");

// get accounts - paginated - total
const getAccounts = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};
    
    const [ total, accounts ] = await Promise.all([
        Account.countDocuments(query),
        Account.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .then()
        .catch(error=>console.log(error))
    ]);

    res.json({
        total,
        accounts
    });

}

const getAccount = async(req, res = response) => {

    const { id } = req.params;

    const account = await Promise.all([
        Account.findById(id)
        .then()
        .catch(error=>console.log(error))
    ]);;

    res.json({
        account
    });

}


const createAccount = async(req, res = response) => {

    const { account_number, pin, client_doc, client_name, client_lastName, balance } = req.body;
    let date = new Date();
    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const pinDate = date.toLocaleDateString('en-us', opciones);
       
   
    let attempts = 0;
    const account = new Account({ account_number, pin, pinDate, client_doc, client_name, client_lastName, balance, attempts });

    // pass encrypt
    const salt = bcryptjs.genSaltSync();
    account.pin = bcryptjs.hashSync( pin.toString(), salt );//one way encryption
    
    //save the account in DB
    await account.save();

    res.json({
        msg: 'The account has been created successfully',
        account
    });

}

const updateAccount = async(req, res = response) => {

    const { id } = req.params;
    const { _id, pin, ...remainData } = req.body;
    
    if( pin ){
        const salt = bcryptjs.genSaltSync();
        remainData.pin = bcryptjs.hashSync( pin, salt );
        let date = new Date();
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const pinDate = date.toLocaleDateString('en-us', opciones);
       
        remainData.pinDate = pinDate;
    }

    const account = await Account.findByIdAndUpdate( id, remainData, {new: true}/*return the updated account and not the old one*/ );

    res.json({
        msg: `The account with id: ${req.params.id} has been updated successfully`,
        account
    });

}

const accountBlocked = async(req, res = response) => {

    const { id } = req.params;

    const account = await Account.findByIdAndUpdate(id, { status: false });

    res.json({
        msg: `Account with id: ${id}, has been blocked`,
        account
    });

}


module.exports = {
    getAccounts,
    getAccount,
    createAccount,
    updateAccount,
    accountBlocked,
}