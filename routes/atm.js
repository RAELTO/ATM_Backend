const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { accountNumberExists, balanceValidator, nonZero } = require('../helpers/db-validator');

const { transfer, getATM, withdrawals } = require('../controllers/atmController');

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

router.put('/withdrawals', [//withdrawals from atm
    check('account_number', 'The account sender is required').not().isEmpty(),
    check('account_number').custom( accountNumberExists ),
    check('amount', 'The amount is required').not().isEmpty(),
    check('amount', 'The amount must be a number').isNumeric(),
    check('amount').custom( nonZero ),
    valFields
], withdrawals);

router.get('/', getATM);

module.exports = router;