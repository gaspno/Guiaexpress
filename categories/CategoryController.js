const express=require('express')
const router=express.Router()
const Category=require('./Category')
const slugify=require('slugify')

router.get('/admin/category/new',(req,res)=>{

    res.render('admin/categories/new')

})

router.post('/category/save',(req,res)=>{

    let title=req.body.title

    if(undefined!=title){
        
        Category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories')
        })
        

    }else{
        res.redirect('/admin/category/new')
    } 

})

router.get('/admin/categories',(req,res)=>{

    Category.findAll().then((categories)=>{
        res.render('admin/categories/index',{categories:categories})
    })    

})

router.post('/categories/delete',(req,res)=>{

    let id=req.body.id

    if(id!=undefined){

        if(!isNaN(id)){      

            Category.destroy({

                where:{
                    id:id
                }

            }).then(()=>{
                res.redirect('/admin/categories')
            }) 

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }

})

router.get('/admin/categories/edit/:id',(req,res)=>{
    let id=req.params.id
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    Category.findByPk(id).then(c=>{
        if(c!=undefined){
            res.render('admin/categories/edit',{category:c})
        }else{
            res.redirect('/admin/categories')
        }
    }).catch(err=>{
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update',(req,res)=>{

    let id=req.body.id
    let title=req.body.title
    let slug=slugify(title)

    if(id!=undefined){

        if(!isNaN(id)){      

            Category.update(

                {title:title,slug:slug},{
                where:{
                    id:id
                }
            }

            ).then(()=>{
                res.redirect('/admin/categories')
            }) 

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }

})


module.exports = router