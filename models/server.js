const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.paths = {
            accounts: '/api/v1/accounts',
            atm: '/api/v1/atm',
            auth: '/api/v1/auth',
        }

        //db connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Routes from my app
        this.routes();//triggers the routes methods
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //body parsing
        this.app.use( express.json() );
    }

    routes() {//my routes configuration

        this.app.get('/', (req, res) => {
            res.send('Hello from ATM API');
        });

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.accounts, require('../routes/accounts') );
        this.app.use( this.paths.atm, require('../routes/atm') );

        this.app.get('*', (req, res) => {
            res.status(404).send(`404 | Endpoint: " ${req.url} " not found`);
        });
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server running in port: ${this.port}`)
        });
    }

}



module.exports = Server;