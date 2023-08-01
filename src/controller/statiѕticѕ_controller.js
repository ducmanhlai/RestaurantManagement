import Model from '../config/sequelize';
import { Op, col, } from 'sequelize';
import { fn, literal } from 'sequelize';
// import sequelize from '../config/sequelize';
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
        try {
            const type = req.query?.type || 'year';
            const year = req.query?.year || 2023;
            let month = req.query?.month || '1';
            const option = type.localeCompare('month') == 0 ? {
                where: {
                    time: {
                        [Op.gte]: new Date(`${year}-${month}-01`),
                        [Op.lte]: new Date(`${year}-${Number.parseInt(month) + 1}-01`),
                    }
                },
                attributes: [[fn('SUM', col('total')), 'total'], [fn('DAY', col('time')), 'day'],],
                group: [fn('day', col('time'))],
            } : {
                where: {
                    time: {
                        [Op.gte]: new Date(`${year}-01-01`),
                        [Op.lte]: new Date(`${year}-12-31`),
                    }
                },
                attributes: [[fn('SUM', col('total')), 'total'], [fn('MONTH', col('time')), 'month'],],
                group: [fn('MONTH', col('time'))],
            }
            const turnover = await Model.bill.findAll(
                option
            )
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: turnover
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Lấy dữ liệu thất bại',
                data: []
            })
        }
    }
    async getTopSellingProducts(req, res) {
        const from = req.query?.from ? new Date(req.query?.from) : new Date(null)
        const to = req.query?.to ? new Date(req.query?.to) : new Date()
        const topSelling = await Model.order_detail.findAll(
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
                attributes: [[fn('COUNT', col('id_dish')), 'num']],
                group: ['id_dish'],
                order: [
                    ['num', 'DESC'],
                ]
            }
        )
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: topSelling
        })
    }
}
export default new statistics_controller()