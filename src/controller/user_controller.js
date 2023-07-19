import Model from '../config/sequelize';
import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize';
import saveImg from 'service/saveImg';
const account = Model.account;
class admin_controller {
    async getStaff(req, res) {
        try {
            const id = req.user?.id || 0;
                const listAcc = await account.findByPk(id,
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
                    })
                res.status(200).send({
                    message: 'Lấy dữ liệu thành công',
                    data: listAcc,
                    errCode:0
                })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Có lỗi xảy ra',
                data: [],
                errCode:1
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
            let { username, password, role, ...staffInfo } = req.body;
            const salt = await bcrypt.genSalt(10);
            const acc = await account.findByPk(req.body.id);
            const obj = req.body?.password ? { password: await bcrypt.hash(password, salt), role, username } : { username, role };
            acc.set(obj)
            if (acc) {
                let staff = await Model.staff.findOne({
                    where: {
                        id_account: req.body.id
                    }
                })

                if (staff) {
                    const avatar = req.files.length == 0 ? staff.dataValues.avatar : `https://firebasestorage.googleapis.com/v0/b/thuctap-c9a4b.appspot.com/o/${saveImg(req, res)}?alt=media`;
                    staff.set({
                        ...staffInfo,
                        avatar:  avatar
                    })
                }
                else {
                    const avatar = req.files.length == 0 ? '' : saveImg(req, res);
                    delete staffInfo['id']
                    staff = await Model.staff.create({ ...staffInfo, avatar, id_account: req.body.id })
                }
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
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Có lỗi xảy ra'
            })
        }
    }
}
export default new admin_controller();