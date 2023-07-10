class home_controller {
    home(req, res) {
        res.render('home')
    }
    menu(req,res){
        res.render('menu')
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
}
export default new  home_controller()