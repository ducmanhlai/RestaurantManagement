import Model from '../config/sequelize';
class type_controller {
    async getType(req, res) {
        try {
            const id = req.query?.id || 0;
            if (id == 0) {
                const listType = await Model.type_dish.findAll(
                    {
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
                const type = await Model.type_dish.findByPk(id)
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: type
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
    async createType(req, res) {
        try {
            const type = await Model.type_dish.create({ ...req.body });
            res.send({
                data: type,
                message: 'Tạo thành công'
            })
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi server'
            })
        }
    }
    async modifyType(req, res) {
        try {
            const { id, name } = req.body;
            const type = await Model.type_dish.findByPk(id);
            type.set({
                name
            })
            await type.save()
            res.send({
                data: type,
                message: 'Cập nhật thành công'
            })
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi server'
            })
        }
    }
}
export default new type_controller()