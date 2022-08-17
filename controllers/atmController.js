const { response } = require("express");

const { Account } = require("../models");


const transfer = async(req, res = response) => {

    const { fromAcc, toAcc, amount  } = req.body;
    
    const acc1 = await Account.findOne({ account_number: fromAcc });
    const acc2 = await Account.findOne({ account_number: toAcc });
    if (acc1.balance > 0 && acc1.balance >= amount) {
        const account1 = await Account.findOneAndUpdate( { account_number: acc1.account_number} , 
            { balance: acc1.balance-amount }, {new: true});
            
        const account2 = await Account.findOneAndUpdate( { account_number: acc2.account_number}, 
            { balance: acc2.balance+amount }, {new: true});

        res.json({
            msg: `The transfer has been made successfully`,
            from: account1.account_number,
            to: account2.account_number
        });
    }else{
        res.json({
            msg: `Insufficient account balance`
        });
    }

}

module.exports = {
    transfer
};