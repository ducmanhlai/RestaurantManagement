import bill from 'models/bill';
import { saveBill } from 'service/bill';
import Model from '../config/sequelize';
import listOrder from 'service/listOrder';
import { Op } from 'sequelize';
class order_controller {
    async payOrder(req, res) {
        try {
            const id = req.query?.id || 1;
            const staff = req.query?.staff || 1;
            const type = req.query?.type || 'cash';
            const order = await Model.order.findByPk(id,
                {
                    include: [
                        {
                            model: Model.order_detail,
                            as: 'order_details',
                            include: {
                                model: Model.food,
                                as: 'id_dish_food',
                                attributes: ['name'],
                            },
                            where: {
                                status: {
                                    [Op.ne]: 3
                                }
                            },
                            attributes: ['price', 'quantity']
                        },
                        {
                            model: Model.staff,
                            as: 'id_staff_staff',
                            attributes: ['name'],
                            raw: true
                        }
                    ],
                    attributes: ['id', 'time', 'table'],
                }
            )
            await listOrder.updateStatusOrder(id, 4)
            await Model.order_detail.update({
                status: 4,
            }, {
                where: {
                    id_order: id,
                },

            })
            listOrder.init()
            let bill = (await saveBill(order, staff, type)).dataValues;
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: { ...order.dataValues, id: bill.id, time: bill.time, staff }
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: []
            })
        }
    }
    async getOrder(req, res) {
        const id = req.query?.id || 1;
        try {
            const order = await Model.order.findByPk(id,
                {
                    include: [
                        {
                            model: Model.order_detail,
                            as: 'order_details',
                            include: {
                                model: Model.food,
                                as: 'id_dish_food',
                                attributes: ['name', 'avatar'],
                            },
                            attributes: ['price', 'quantity', 'status']
                        },
                        {
                            model: Model.staff,
                            as: 'id_staff_staff',
                            attributes: ['name'],
                            raw: true
                        }
                    ],
                    attributes: ['id', 'time', 'table'],
                }
            )
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: order
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: {}
            })
        }
    }
    async getByTable(req, res) {
        const id = req.query?.id || 1;
        try {
            const order = await Model.order.findOne(
                {
                    where: {
                        table: id
                    },
                    include: [
                        {
                            model: Model.order_detail,
                            as: 'order_details',
                            include: {
                                model: Model.food,
                                as: 'id_dish_food',
                                attributes: ['name', 'avatar'],
                            },
                            attributes: ['price', 'quantity', 'status']
                        },
                        {
                            model: Model.staff,
                            as: 'id_staff_staff',
                            attributes: ['name'],
                            raw: true
                        }
                    ],
                    attributes: ['id', 'time', 'table'],
                    order: [['time', 'DESC']]
                    
                }
            )
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: order
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: {}
            })
        }
    }
}
export default new order_controller()