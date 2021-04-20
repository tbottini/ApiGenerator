const Model = require("../model");
const PurchasesController = require("../controller/purchasesController");
const PurchasesRouter = require("../router/purchasesRouter");

class PurchasesModel extends Model 
{
    constructor(param) {
        param.Controller = PurchasesController;
        param.Router = PurchasesRouter;

        super(param);
    }
}

module.exports = PurchasesModel;