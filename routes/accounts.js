const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { accountExistingId, accountValidator } = require('../helpers/db-validator');

const { getAccounts, 
    getAccount, createAccount, 
    updateAccount, accountBlocked } = require('../controllers/accountsController');

const router = Router();

router.get('/', getAccounts);

router.get('/:id', [
    check('id', 'It is not a valid mongodb ID').isMongoId(),
    check('id').custom( accountExistingId ),
    valFields
], getAccount);

router.post('/', [
    check('account_number', 'An account number is required').not().isEmpty(),
    check('account_number').custom( accountValidator ),
    check('pin', 'Category is required').not().isEmpty(),
    check('pin', 'A pin is required and it must have a 4 digits length').isLength({ min: 4, max: 4 }),
    check('client_doc', 'The client doccument is required').not().isEmpty(),
    check('client_name', 'The client name is required').not().isEmpty(),
    check('client_lastName', 'The client last name is required').not().isEmpty(),
    check('balance', 'the balance must be a number').isNumeric(),
    valFields
], createAccount);

router.put('/:id', [
    check('id', 'It is not a valid mongodb ID').isMongoId(),
    check('id').custom( accountExistingId ),
    check('account_number').custom( accountValidator ),
    //check('pin', 'A pin is required and it must have a 4 digits length').isLength({ min: 4, max: 4 }),
    valFields
], updateAccount);

router.delete('/:id', [
    check('id', 'Its not a valid mongodb ID').isMongoId(),
    check('id').custom( accountExistingId ),
    valFields
], accountBlocked);

module.exports = router;