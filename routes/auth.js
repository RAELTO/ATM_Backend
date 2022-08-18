const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { login, updatePin} = require('../controllers/auth');

const { accountNumberExists } = require('../helpers/db-validator');

const router = Router();

router.post('/login', [
    check('account_number', 'The account sender is required').not().isEmpty(),
    check('account_number').custom( accountNumberExists ),
    check('pin', 'The pin is required').not().isEmpty(),
    valFields
],login);

router.put('/update', [//withdrawals from atm
    check('account_number', 'The account sender is required').not().isEmpty(),
    check('account_number').custom( accountNumberExists ),
    check('pin', 'The pin is required').not().isEmpty(),
    check('newPin', 'The new pin is required').not().isEmpty(),
   
    valFields
], updatePin);



module.exports = router;