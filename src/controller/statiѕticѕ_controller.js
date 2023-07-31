import Model from '../config/sequelize';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize';
class statistics_controller {
    async getTurnoverInDay(req, res) {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        const orders = await Model.bill.findAll({
            where: {
                time: {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                }
            },
            order: [
                ['time', 'ASC'],
            ]
        });
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: orders
        })
    }
    async getTurnover(req, res) {

    }
    async getTopSellingproducts(res, req) {
        
    }
}
export default new statistics_controller()