//
const bodyParser = require('body-parser')
const express=require('express')
const connection = require('./database/database')
const path = require('path');
const categoryController=require('./categories/CategoryController')
const articleController=require('./articles/ArticleController')
const userController=require('./user/UserController') 
const session=require('express-session')
const Article=require('./articles/Article')
const Category=require('./categories/Category')


const app=express()
//
app.set('view engine','ejs')
app.use(session({
    secret:'bobesponjacalçaquadrada...',
    cookie:{
        maxAge:120000
    }
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
//
app.use(express.static('public'))
//
connection.authenticate().then(()=>{
    console.log('conexão realizada')
}).catch(err=>{
    console.warn(err)
    })
//
app.use('/',categoryController)
app.use('/',articleController)
app.use('/',userController)




app.get('/mysite', (request,response)=>{

    let quantity=6

    Article.findAll(
        {order:[[
            'id','asc'
        ]],
        include:[{model:Category}],
        limit:quantity
    })
    .then(articles=>{
        Category.findAll().then(categories=>{
            response.render('index',{a:articles,c:categories})
        })
        

    })

   
})

app.get("/:slug",(request,response)=>{

    let slug=request.params.slug
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article!=undefined){
            Category.findAll().then(categories=>{

                response.render('admin/articles/article',{a:article,c:categories})
            })
           
        }else{
            response.redirect('/mysite')
        }
    }).catch(err=>{
        response.redirect('/mysite')  
    })


})

app.get("/category/:slug",(request,response)=>{

    let slug=request.params.slug
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category=>{
        if(category!=undefined){
            Category.findAll().then(categories=>{
                response.render('index',{a:category.articles,c:categories})
                console.log(category.articles)
            })
        }
        else{
            response.redirect('/mysite')
        }
    }).catch(err=>{
        response.redirect('/mysite')
    })


})



app.listen(80,()=>{

})