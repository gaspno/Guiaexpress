const express=require('express')
const router=express.Router()
const Category=require('../categories/Category')
const Article=require('./article')
const slugify=require('slugify')
const adminAuth=require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth,(req,res)=>{
    

    Article.findAll({
        include:[{model:Category}]
    }).then(articles=>{
        res.render('admin/articles/index',{a:articles})
    })

 

})

router.post('/articles/delete',(req,res)=>{

    let id=req.body.id

    if(id!=undefined){

        if(!isNaN(id)){      

            Article.destroy({

                where:{
                    id:id
                }

            }).then(()=>{
                res.redirect('/admin/articles')
            }) 

        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/admin/articles')
    }

})

router.get('/admin/articles/new',(req,res)=>{


    Category.findAll().then(c=>{
        res.render('admin/articles/new',{categories:c})
    })

   
})

router.post('/articles/save',(req,res)=>{


    let title=req.body.title
    let body=req.body.body
    let idCategory=req.body.category

    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:idCategory

    }).then(
        res.redirect('/admin/articles')
    )
   
})


router.get('/admin/articles/edit/:id',(req,res)=>{


    let id=req.params.id;
    Article.findByPk(id).then(article=>{
        if(article!=undefined){
            
            Category.findAll().then(categories=>{
                res.render('admin/articles/edit',{a:article,categories:categories})
            })
                      
        }else{
            res.redirect('/mysite')
        }

    }).catch(err=>{
        res.redirect('/mysite')
    })
    
})

router.post('/articles/update',(req,res)=>{

    let id=req.body.id
    let title=req.body.title
    let body=req.body.body
    let idCategory=req.body.category

    Article.update({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:idCategory
    },
    {
        where:{id:id}
    }
    ).then(
        res.redirect('/admin/articles')
    ).catch(err=>{
        res.redirect('/mysite')
    })

})

router.get('/articles/page/:num',(req,res)=>{


    let quantity=6
    let page=req.params.num
    let offset=Number(page)

    if(isNaN(page)||page==1){
        offset=0
    }else{
        offset=(offset-1)*quantity
    }
    

    Article.findAndCountAll(
        {order:[[
            'id','asc'
        ]],
        limit:Number(quantity),
        offset:offset
    }).then(articles=>{


        let next;
        if(offset+quantity>=articles.count){
            next=false        
        }else{
            next=true
        }
        let result={
            page:Number(page),
            articles:articles,
            next:next

        }

        Category.findAll().then(categories=>{

            res.render('admin/articles/page',{result:result,c:categories})
        })

        
    })

  
})


module.exports = router