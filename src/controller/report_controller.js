import Model from '../config/sequelize';
import { Op, col, } from 'sequelize';
import { fn, literal } from 'sequelize';
class report_controller {
    async getReportByTime(req, res) {
        const from = req.query?.from ? new Date(req.query?.from) : new Date(null)
        const to = req.query?.to ? new Date(req.query?.to) : new Date()
        const list = await Model.order_detail.findAll(
            {
                where: {
                    status: {
                        [Op.ne]: 3
                    },
                    time: {
                        [Op.gt]: from,
                        [Op.lt]: to
                    }
                },
                include: {
                    model: Model.food,
                    as: 'id_dish_food',
                    attributes: ['name'],
                },
                attributes: [[fn('COUNT', col('id_dish')), 'num'],'price'],
                group: ['id_dish', 'order_detail.price'],
                order: [
                    ['id_dish', 'DESC'],
                ],  
            }
        )
        const total = await Model.order_detail.count({
            where:{
                status: {
                    [Op.ne]: 3
                },
            }
        })
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: {list,total}
        })
    }
   
}
export default new report_controller()