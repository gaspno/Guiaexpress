const express=require('express')
const router=express.Router()
const User = require('./user')
const bcrypt = require('bcryptjs')



router.get('/admin/user/create',(req,res)=>{

    res.render('admin/users/create')

})

router.get('/admin/users',(req,res)=>{

    User.findAll().then(users=>{
        res.render('admin/users/list',{users:users})
    })
    

})

router.post('/users/create',(req,res)=>{

    let email = req.body.email
    let password=req.body.password

    let salt=bcrypt.genSaltSync(10)
    let hash=bcrypt.hashSync(password,salt)

    User.findOne({
       where:{email:email}
    }).then(user=>{
        if(user==undefined){
            User.create({
                email:email,
                password:hash
            }).then(
                res.redirect('/mysite')
            ).catch((err)=>{
                res.redirect('/mysite')
            })
        }
        else{
            res.redirect('/admin/user/create')
        }
    })

  

})

router.get('/login',(req,res)=>{

    res.render('admin/users/login')
    

})

router.post('/authenticate',(req,res)=>{

    let email=req.body.email
    let password=req.body.password

    User.findOne({where:{email:email}}).then(user=>{
       if(user!=undefined){
           
        let correct=bcrypt.compareSync(password,user.password)
        if(correct){
            if(req.session.users===undefined){
                req.session.users=[]
            }
            req.session.users.push({
                id:user.id,
                email:user.email
            })
            res.json(req.session.users)
        }else{
            res.redirect('/login')
        }
       }else{
        res.redirect('/login')
       }
    }).catch(err=>{
        res.json(req.session.users)
    }
        )


})

router.get('/logout',(req,res)=>{
    req.session.users=undefined
    res.redirect('/mysite')
})





module.exports = router