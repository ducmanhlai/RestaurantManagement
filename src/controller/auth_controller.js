import Model from '../config/sequelize';
const account= Model.account;
class auth_controller{
    async login(req,res) {
        const {username,password} = req.body;
        account.findOne()
        res.status(200).send(req.body)
    }
}
export default new auth_controller()