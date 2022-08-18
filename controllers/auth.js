//controlador para login o autenticación
const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Account = require('../models/accounts');

const login = async(req, res = response) => {

    const account_number= req.body.account_number;
    const pin = req.body.pin;
    try {
        
        //Verificar si el email existe
        const account = await Account.findOne({ where: { account_number: account_number } });
        // console.log(account);
        if(!account){
            return res.status(400).json({
                msg: "User / Account number is incorrect",
                validLogin: false
            });
        }
        
        //Verificar si el usuario esta activo
        if(!account.status){
            return res.status(400).json({
                msg: "User / Acccount is blocked - status: false",
                validLogin: false
            });
        }

        // Password verify
        const validPassword = bcryptjs.compareSync( pin, account.pin );
        //compara la passw del body vs la del usuario, retorna un booleano
        if (!validPassword) {
            const account1 = await Account.findOneAndUpdate( { account_number: account.account_number} , 
                { attempts: account.attempts + 1 }, {new: true});
            if(account1.attempts >= 3){
                accountBlocked(account1.id);
                return res.status(400).json({
                    msg: `Account with id: ${account1.id}, has been blocked`,
                    
                    validLogin: false
                });
            }
            else{
                return res.status(400).json({
                    msg: "User / Password incorrect - password",
                    
                    validLogin: false
                });
            }
            
        }

        

        let date1 = new Date(account.pinDate);
   
        let day1 = date1;
        let day2 = new Date();

        let difference= Math.abs(day2-day1);
        let days = Math.round(difference/(1000 * 3600 * 24));

        // console.log(days);

        if(days >= 90){

            return res.status(400).json({
                msg: `Account with id: ${account.id}, must update the pin`,
                validLogin: false
            });

        }

        // Generar el JWT
        // const token = await genJWT( user.id );
        const account1 = await Account.findOneAndUpdate( { account_number: account.account_number} , 
            { attempts: 0 }, {new: true});
        res.json({
            account1,
            // token,
            validLogin: true
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Consult with the administrator"
        })
    }

}

const accountBlocked = async(id) => {


    const account = await Account.findByIdAndUpdate(id, { status: false });
   console.log(account);

    

}

const updatePin = async(req, res = response) => {

    

    const account_number= req.body.account_number;
    const pin = req.body.pin;
    const newPin = req.body.newPin;
    try {
        
        //Verificar si el email existe
        const account = await Account.findOne({ where: { account_number: account_number } });
        // console.log(account);
        if(!account){
            return res.status(400).json({
                msg: "User / Account number is incorrect",
                validLogin: false
            });
        }
        

        // Password verify
        const validPassword = bcryptjs.compareSync( pin, account.pin );
        //compara la passw del body vs la del usuario, retorna un booleano
        if (!validPassword) {

                return res.status(400).json({
                    msg: "User / Password incorrect - password",
                    
                    validLogin: false
                });       
        }

        const salt = bcryptjs.genSaltSync();
        let pin1 = bcryptjs.hashSync( newPin, salt );
        let date = new Date();
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const pinDate = date.toLocaleDateString('en-us', opciones);
       
        // Generar el JWT
        // const token = await genJWT( user.id );
        const account1 = await Account.findOneAndUpdate( { account_number: account.account_number} , 
            { pin: pin1, pinDate: pinDate }, {new: true});
        res.json({
            account1,
            // token,
            validLogin: true
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Consult with the administrator"
        })
    }

    

}


module.exports = {
    login,
    updatePin
}