import Model from '../config/sequelize';
import { Op, col, } from 'sequelize';
import { fn, literal } from 'sequelize';
class statistics_controller {
    async getgetRevenueInDay(req, res) {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        const orders = await Model.bill.findAll({
            where: {
                time: {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                }
            },
            attributes: [[fn('SUM', col('total')), 'total']]
        });
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: orders
        })
    }
    async getRevenue(req, res) {
        try {
            const type = req.query?.month ? 'month' : 'year';
            const year = req.query?.year || new Date().getFullYear();
            let month = req.query?.month || new Date().getMonth() + 1;
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
            if (type.localeCompare('month') == 0) {
                const monthlyTotals = new Array(31).fill(0);
                // Điền giá trị total vào mảng
                turnover.forEach(entry => {
                    const monthIndex = entry.dataValues.day - 1;  // Chuyển tháng thành chỉ số (0-11)
                    const total = parseInt(entry.dataValues.total);
                    monthlyTotals[monthIndex] = total;
                });
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: monthlyTotals
                })
            }
            else {
                const monthlyTotals = new Array(12).fill(0);
                // Điền giá trị total vào mảng
                turnover.forEach(entry => {
                    const monthIndex = entry.dataValues.month - 1;  // Chuyển tháng thành chỉ số (0-11)
                    const total = parseInt(entry.dataValues.total);
                    monthlyTotals[monthIndex] = total;
                });
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: monthlyTotals
                })
            }

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
                ],
                limit: 5
            }
        )
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: topSelling
        })
    }
    async getTopRenueveProducts(req, res) {
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
                attributes: [[fn('SUM', col('order_detail.price')), 'num'], 'id_dish', [fn('SUM', col('quantity')), 'quantity']],
                group: ['id_dish'],
                order: [
                    ['num', 'DESC'],
                ],
                limit: 5
            }
        )
        res.status(200).send({
            message: 'Lấy dữ liệu thành công',
            data: topSelling
        })
    }
}
export default new statistics_controller()