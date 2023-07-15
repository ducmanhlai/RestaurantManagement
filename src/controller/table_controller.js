import Model from '../config/sequelize';
class type_controller {
    async get(req, res) {
        try {
            const id = req.query?.id || 0;
            if (id == 0) {
                const listType = await Model.table.findAll(
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
                const type = await Model.table.findByPk(id)
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
    async create(req, res) {
        try {
            const type = await Model.table.create({ ...req.body });
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
    async modify(req, res) {
        try {
            const { id, name } = req.body;
            const type = await Model.table.findByPk(id);
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