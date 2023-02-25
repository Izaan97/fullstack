let uniqid = require('uniqid');
let CallbackRequest = require('../models/callback-requests.model').CallbackRequest;
let express = require('express');
let router = express.Router();
let authMiddlware = require('../middleware/auth');

router.get('/', authMiddlware, async (req, resp) => {
    resp.send(await CallbackRequest.find());
 }); 

router.post('/', async (req, resp) => {
   let reqBody = req.body;
   let newRequest = new CallbackRequest({
    id: uniqid(),
    phoneNumber: reqBody.phoneNumber,
    date: new Date()
    });  
    await newRequest.save();
    resp.send('Accepted');
});

router.delete('/:id', authMiddlware, async (req, resp) => {
    await CallbackRequest.deleteOne({id: req.params.id});
    resp.send('Deleted');
});

module.exports = router;
