const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    Userid:{
        type:String
    },
    name:[String]
});


const Stock = mongoose.model('stocks',stockSchema);
module.exports = Stock;