import createBill from "service/createBill"

class home_controller {
    home(req, res) {
        res.render('home')
    }
    food(req,res){
        res.render('food')
    }
    staff(req,res){
        res.render('staff')
    }
    statistics(req,res){
        res.render('statistics')
    }
    login(req,res){
        res.render('login')
    }
    createOrder(req,res){
        res.render('createOrder')
    }
    bill(req,res){
        res.render('bill')
        createBill()
    }
    bill_pdf(req,res){
        res.render('bill')
    }
}
export default new  home_controller()