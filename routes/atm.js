const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { accountNumberExists } = require('../helpers/db-validator');

const { transfer, getATM, createATM } = require('../controllers/atmController');

const router = Router();

router.put('/transfers', [//transfers account to account
    check('fromAcc', 'The account sender is required').not().isEmpty(),
    check('fromAcc').custom( accountNumberExists ),
    check('toAcc', 'The account receiver is required').not().isEmpty(),
    check('toAcc').custom( accountNumberExists ),
    check('amount', 'The amount is required').not().isEmpty(),
    check('amount', 'The amount must be a number').isNumeric(),
    valFields
], transfer);

router.get('/', getATM);

router.post('/', [
    check('bill100', 'The bill must be a number').isNumeric(),
    check('bill50', 'The bill must be a number').isNumeric(),
    check('bill20', 'The bill must be a number').isNumeric(),
    check('bill10', 'The bill must be a number').isNumeric(),
    check('quantity', 'The bill must be a number').isNumeric(),
    check('total', 'The bill must be a number').isNumeric(),
  
    valFields
], createATM);

module.exports = router;