import Model from '../config/sequelize';
import { Op, col, } from 'sequelize';
import { fn, literal } from 'sequelize';
class report_controller {
    async getReportByTime(req, res) {
        try {
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
                    attributes: [[fn('SUM', col('quantity')), 'num'],'price'],
                    group: ['id_dish', 'order_detail.price'],
                    order: [
                        ['id_dish', 'DESC'],
                    ],  
                }
            )
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: {list}
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Lấy dữ liệu thất bại',
                
            })
        }
       
    }
   
}
export default new report_controller()