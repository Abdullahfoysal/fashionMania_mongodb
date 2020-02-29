var express = require('express');
var router = express.Router();


//Get page model
var Page = require('../models/page');


/*
 *Get pages index 
 */

router.get('/',function(req,res){
    Page.find({}).sort({sorting: 1}).exec(function (err,pages){
        res.render('admin/pages',{
            title: 'Admin',
            pages: pages
        });
    });
});

/*
 *Get add page 
 */

router.get('/add-page',function(req,res){
    
    var title="";
    var slug="";
    var content="";
    
//    //testing 
//    Page.find({
//        title:'home'
//    })
//            .then(doc=>{
//                console.log(doc);
//    })
//            .catch(err=>{
//                console.error(err);
//    });
    
    
    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    });
});

/*
 *POST add page 
 */

router.post('/add-page',function(req,res){
    
    req.checkBody('title','Title must have a value.').notEmpty();
    req.checkBody('content','Content must have a value.').notEmpty();
    
    
    var title= req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug =="") slug = title.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;
   
    var errors =req.validationErrors();
 
    if(errors){       
        
        res.render('admin/add_page',{
        errors:errors, 
        title:title,
        slug:slug,
        content:content
         });
    }else{
        
        Page.findOne({slug:slug},function(err,page){
        if(page){
               req.flash('danger','Page slug exists, choose another.');
                res.render('admin/add_page',{
                title:title,
                slug:slug,
                content:content
                 });
           } else {
               var page = new Page({
                  title: title,
                  slug: slug,
                  content: content,
                  sorting: 100
               });
               
           
               page.save(function(err){
                  if(err) return console.log('err');
                 
                  req.flash('success','Page added!');
                  res.redirect('/admin/pages');
               });
           } 
        });
    }
    
    
});

//Exports
module.exports =router;