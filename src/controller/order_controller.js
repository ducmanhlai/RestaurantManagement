import bill from 'models/bill';
import { saveBill } from 'service/bill';
import Model from '../config/sequelize';
class order_controller {
    async getOrder(req, res) {
        try {
            const id = req.query?.id || 0;
            const staff = req.query?.staff || 1;
            if (id == 0) {
                const listType = await Model.order.findAll(
                    {
                        include:{
                            model: Model.order_detail,
                            as: 'order_details'
                        },
                        order: [
                            ['id', 'ASC'],
                        ]  
                    }
                )
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: listType
                })
            }
            else {
                const order = await Model.order.findByPk(id,
                    {
                        include: [
                            {
                                model: Model.order_detail,
                                as: 'order_details',
                                include:{
                                    model:Model.food,
                                    as:'id_dish_food',
                                    attributes: ['name']
                                },
                                attributes: ['price','quantity']
                            },
                            {
                                model: Model.staff,
                                as: 'id_staff_staff',
                                attributes: ['name'],
                                raw:true
                            }
                        ],
                        attributes: ['id','time','table'],
                    }
                    )
              let bill =(await saveBill(order,staff)).dataValues;
            
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: {...order.dataValues,id:bill.id,time:bill.time}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: []
            })
        }
    }
}
export default new order_controller()