const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { accountNumberExists } = require('../helpers/db-validator');

const { transfer } = require('../controllers/atmController');

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

module.exports = router;