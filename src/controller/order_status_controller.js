import Model from '../config/sequelize';
import saveImg from 'service/saveImg';
const statusModel = Model.status_order;
class status_order_controller {
    async get(req, res) {
        try {
            const listStatus = await statusModel.findAll(
                {
                    order: [
                        ['id', 'ASC'],
                    ]
                })
            res.status(200).send({
                message: 'Lấy dữ liệu thành công',
                data: listStatus
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: []
            })
        }
    }
    // async create(req, res) {
    //     try {
    //         const avatar = req.files.length == 0 ? "" : `https://firebasestorage.googleapis.com/v0/b/thuctap-c9a4b.appspot.com/o/${saveImg(req, res)}?alt=media`;
    //         const food = await foodModel.create({ ...req.body, avatar });
    //         res.send({
    //             message: 'Tạo món ăn thành công',
    //             data: food
    //         })
    //     } catch (error) {
    //         res.send({
    //             message: 'Tạo món ăn thất bại',
    //             data: []
    //         })
    //     }
    // }
    // async modify(req, res) {
    //     try {
    //         const { id, ...info } = req.body;
    //         const food = await foodModel.findByPk(id);
    //         const avatar = req.files.length == 0 ? food.dataValues.avatar : `https://firebasestorage.googleapis.com/v0/b/thuctap-c9a4b.appspot.com/o/${saveImg(req, res)}?alt=media`;
    //         food.set({
    //             ...info,
    //             avatar
    //         })
    //         await food.save()
    //         res.send({
    //             data: food,
    //             message: 'Cập nhật thành công'
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).send({
    //             message: 'Lỗi server'
    //         })
    //     }
    // }
}
export default new status_order_controller()