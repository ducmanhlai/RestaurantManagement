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
}
export default new  home_controller()