import Model from '../config/sequelize';
import bcrypt from 'bcrypt'
import { createJWT } from 'config/jwt';
import { Sequelize } from 'sequelize';
import saveImg from 'service/saveImg';
const account = Model.account;
class admin_controller {

    async getStaff(req, res) {

        try {
            const id = req.query?.id || 0;
            if (id == 0) {
                const listAcc = await account.findAll(
                    {

                        include: [{
                            model: Model.staff,
                            as: 'staffs'
                        },

                        {
                            model: Model.role,
                            as: 'role_role',
                            where: { id: { [Sequelize.Op.ne]: 1 } }
                        },
                        ],
                        order: [
                            ['id', 'ASC'],
                        ]
                    })
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: listAcc
                })
            }
            else {
                const listAcc = await account.findByPk(id,
                    {
                        where: { role: { [Sequelize.Op.ne]: 1 } },
                        include: [{
                            model: Model.staff,
                            as: 'staffs'
                        },

                        {
                            model: Model.role,
                            as: 'role_role',
                            where: { id: { [Sequelize.Op.ne]: 1 } }
                        },
                        ],
                        order: [
                            ['id', 'DESC'],
                        ]
                    })
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: listAcc
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
    async createStaff(req, res) {
        try {
            const { username, password, role, name, salary, phone } = req.body;
            const avatar = req.files.length == 0 ? "" : saveImg(req, res)
            const salt = await bcrypt.genSalt(10);
            const new_password = await bcrypt.hash(password, salt)
            const acc = await account.create({
                user_name: username,
                password: new_password,
                role
            })
            if (acc) {
                const staff = await Model.staff.create({
                    id_account: acc.id,
                    salary,
                    phone,
                    name,
                    avatar: `https://firebasestorage.googleapis.com/v0/b/thuctap-c9a4b.appspot.com/o/${avatar}?alt=media`,
                    create_at: new Date()
                })
                if (staff) {
                    return res.status(200).send({
                        message: 'Tạo tài khoản thành công',
                        data: { acc, staff }
                    })
                }
            }
            res.status(200).send({
                message: 'Tạo tài khoản thất bại',
                data: []
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Có lỗi xảy ra'
            })
        }
    }
    async modifyStaff(req, res) {
        try {
            const { password, role, staffInfo } = req.body;
            const avatar = req.files.length == 0 ? "" : saveImg(req, res)
            const salt = await bcrypt.genSalt(10);
            const new_password = await bcrypt.hash(password, salt)
            const acc = await account.findByPk(req.body.id);
            const obj = req.body?.password ? { password, role } : { role };
            acc.set(obj)
            if (acc) {
                const staff = await Model.staff.findOne({
                    where: {
                        id_account: req.body.id
                    }
                })
                staff.set({
                    staffInfo
                })
                Promise.all([acc.save(), staff.save()]).then(data => {
                    return res.status(200).send({
                        message: 'Cập nhật thành công',
                        data: data
                    })
                }).catch(err => {
                    return res.status(200).send({
                        message: 'Cập nhật thất bại',
                        data: []
                    })
                })
            }
            res.status(200).send({
                message: 'Có lỗi xảy ra',
                data: []
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Có lỗi xảy ra'
            })
        }
    }
}
export default new admin_controller();