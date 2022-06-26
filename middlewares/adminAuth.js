function adminAuth(req,res,next){

    if(req.session.users!=[]&&req.session.users!=undefined){
        next()
    }else{
        res.redirect('/login')
    }
    

}

module.exports=adminAuth