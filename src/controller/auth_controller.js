import Model from '../config/sequelize';
import bcrypt from 'bcrypt'
import { createJWT } from 'config/jwt';
const account = Model.account;
const saltRounds = 10;
class auth_controller {
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const acc = await account.findOne({ where: { user_name: username } });
            if (acc) {
                const match = await bcrypt.compare(password, acc.dataValues.password);
                if (match) {
                    res.status(200).send({
                        accessToken: createJWT(acc.dataValues),
                        refreshToken: createJWT(acc.dataValues, 'REFRESH'),
                        message: 'Đăng nhập thành công'
                    })
                }
            }
            else res.status(200).send({ message: 'Sai tên đăng nhập hoặc mật khẩu' })
        } catch (error) {
            res.status(500).send({ message: 'Có lỗi xảy ra' })
        }

    }
}
export default new auth_controller()