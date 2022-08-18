const { response, request } = require("express");

const { Account, Atm } = require("../models");


const transfer = async(req, res = response) => {

    const { fromAcc, toAcc, amount  } = req.body;

    if (fromAcc === toAcc) {
        res.json({
            msg: `The accounts numbers cannot be the same`
        });
    }else{
        const acc1 = await Account.findOne({ account_number: fromAcc });
        const acc2 = await Account.findOne({ account_number: toAcc });
        if (amount > 0) {
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
        }else{
            res.json({
                msg: `The amount to be transferred must be greater than zero`
            });
        }
    }

}

const withdrawals = async(req, res = response) => {

    const { account_number } = req.body;
    let amount = req.body.amount;
    const atmId = '62fd5fabe8e680ade30c177b';
    const atm1Cash = await Atm.findById(atmId);
    const acc = await Account.findOne({ account_number: account_number });
    let b100 = 0;
    let b50 = 0;
    let b20 = 0;
    let b10 = 0;

    if (acc.balance >= amount) {
        if (amount <= 800000) {
            if(amount <= atm1Cash.total){
                b100 = Math.trunc(amount/100000);
                amount = amount % 100000;
                if(b100 >= atm1Cash.bill100){
                    amount += (b100-atm1Cash.bill100)*100000;
                    b100 = atm1Cash.bill100;
                }
                b50 = Math.trunc(amount/50000);
                amount = amount % 50000;
                if(b50 >= atm1Cash.bill50){
                    amount += (b50-atm1Cash.bill50)*50000;
                    b50 = atm1Cash.bill50;
                }
                b20 = Math.trunc(amount/20000);
                amount = amount % 20000;
                
                if(b20 >= atm1Cash.bill20){
                    amount += (b20 - atm1Cash.bill20)*20000;
                    b20 = atm1Cash.bill20
                }
        
                b10 = Math.trunc(amount/10000);
                amount = amount % 10000;
                if(b10 >= atm1Cash.bill10){
                    amount += (b10 - atm1Cash.bill10)*10000;
                    b10 = atm1Cash.bill10
                }
        
                if(amount === 0){
                    await Atm.findByIdAndUpdate( atmId, { bill100: atm1Cash.bill100-b100 }, {new: true});
                    await Atm.findByIdAndUpdate( atmId, { bill50: atm1Cash.bill50-b50 }, {new: true});
                    await Atm.findByIdAndUpdate( atmId, { bill20: atm1Cash.bill20-b20 }, {new: true});
                    await Atm.findByIdAndUpdate( atmId, { bill10: atm1Cash.bill10-b10 }, {new: true});
                    const cash = await Atm.findById(atmId);
                    const total = await Atm.findByIdAndUpdate( atmId, { total: cash.bill100*100000+cash.bill50*50000+cash.bill20*20000+cash.bill10*10000}, {new: true});
                    const account = await Account.findOne({ account_number: account_number });
                    const updatedBalance = await Account.findOneAndUpdate( { account_number: account_number}, 
                        { balance: account.balance - (b100*100000+b50*50000+b20*20000+b10*10000) }, {new: true});
                    res.json({
                        msg: 'Successful withdrawal',
                        received: {
                        billOf100: b100,
                        billOf50: b50,
                        billOf20: b20,
                        billOf10: b10,
                        },
                        atm_cash_remaining: total.total,
                        account_balance: updatedBalance.balance
                    });
                }else{
                    res.json({
                        msg: 'Invalid amount'
                    });
                }
            
            }else{
                res.json({
                    msg: 'Insufficient funds'
                });
            }
        }else{
            res.json({ msg: 'The maximum allowed amount is $800.000 COP' })
        }
    }else{
        res.json({
            msg: 'Insufficient account balance'
        });
    }

}


// show cash in atm
const getATM = async(req = request, res = response) => {

    const  atm  = await Promise.all([
        Atm.find()
        .then()
        .catch(error=>console.log(error))
    ]);

    res.json({
        atm
    });

}

module.exports = {
    transfer,
    getATM,
    withdrawals,
};
