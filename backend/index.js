const express = require('express');
const app = express();
const config = require('./config');
const Clothe = require('./models/clothes')
const Category = require('./models/category')
const Review = require('./models/reviews')
const Order = require('./models/orders')
const Item = require('./models/item')
const User = require('./models/user')
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 4;
const { Op } = require('sequelize');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


config.authenticate()
.then(()=>{
    console.log('Database is connected.');
})
.catch((err)=>{
    console.log(err);
});


///Register
app.post('/register', (req, res) =>{
 
    let plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
        
        let user_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash,
        };

        User.create(user_data).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });

    });    
});

//login 
app.post('/login', function(req, res){

    let email = req.body.email;
    let password = req.body.password;
    let user_data = {
        where: {email}
    }
    
   
    User.findOne(user_data).then((result) => {

        if(result){
            console.log(result);
            bcrypt.compare(password, result.password, function(err, output) {
                console.log(output);
                if(output){
                    res.status(200).send(result);
                }else{
                    res.status(400).send('Incorrect password.');
                }
            });            
        }
        else{
            res.status(404).send('User does not exist.');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
        
});


//Relationships
Clothe.belongsTo(Category, {
    foreignKey: "category_id"
})

Category.hasMany(Clothe, {
    foreignKey: "category_id"
})


Review.belongsTo(Clothe, {
    foreignKey: "clothes_id"
})

Clothe.hasMany(Review, {
    foreignKey: "clothes_id"
})




///Routes

//get clothes
app.get('/clothes', (req, res) =>{

    Clothe.findAll().then((result)=>{
        res.status(200).send(result)
    }).catch((err)=>{
        res.status(500).send(err)
    })

})


app.get('/clozy/:clothes_id', (req, res) =>{
    const clothes_id = parseInt(req.params.clothes_id)

    Clothe.findByPk(clothes_id).then((result) =>{
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
})


//post clothes
app.post('/clothes', (req, res) =>{

    let clotheData = req.body

    Clothe.create(clotheData).then((result)=>{
        res.status(200).send(result)

    }).catch((err)=>{
        res.status(500).send(err)
    })
})

app.delete("/clozy/:clothes_id", function (req, res) {
    const clothes_id = parseInt(req.params.clothes_id);
  
    Clothe.findByPk(clothes_id)
      .then(function (result) {
        if (!result) {
          res.status(404).send("clothing not found");
        } else {
          result
            .destroy()
            .then(function () {
              res.status(200).send(result);
            })
            .catch(function (err) {
              res.status(500).send(err);
            });
        }
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  });
  
  app.patch("/clozy/:clothes_id", function (req, res) {
    const clothes_id = parseInt(req.params.clothes_id);
    let cData = req.body;
  
    Clothe.findByPk(clothes_id)
      .then(function (result) {
        if (!result) {
          res.status(404).send("clothes_id not found");
          return;
        }
  
        result.price = cData.price;
  
        result
          .save()
          .then(function () {
            res.status(200).send(result);
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  });
  

//clothes by gender
app.get('/clothes/type', (req, res)=>{
    let cData = {
        where: {},
        include: Category
        
    };


    if(req.query.gender !== undefined){
        cData.where.gender = req.query.gender
    }

    if(req.query.category_id !== undefined){
        cData.where.category_id = req.query.category_id
    }

    
    console.log(req.query.gender);
    console.log(req.query.category_id);

    Clothe.findAll(cData).then((result)=>{
        res.status(200).send(result)

    }).catch((err)=>{
        res.status(500).send(err)
    })
})
//clothes Search
app.get('/clothes/search', (req, res)=>{
    let cData = {
        where: {},
      };
    
      if (req.query.name !== undefined) {
        cData.where.name = {
          [Op.like]: `%${req.query.name}%`,
        };
      }
    
      Clothe.findAll(cData)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
})


app.get('/clothes/reviews', (req, res) => {
    let cData = {
        where: {},
        include: Review
        
    };


    if(req.query.gender !== undefined){
        cData.where.gender = req.query.gender
    }

  
   

    
    console.log(req.query.gender);
    console.log(req.query.clothes_id);

    Clothe.findAll(cData).then((result)=>{
        res.status(200).send(result)
        
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

app.get('/creview/:clothes_id', (req, res) =>{
    const clothes_id = parseInt(req.params.clothes_id)

    Clothe.findByPk(clothes_id, {
        include: Review
    }).then((result) =>{
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
})
app.get('/cr', (req, res) =>{
    

    Clothe.findAll( {
        include: Order
    }).then((result) =>{
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
})





//Orders
app.get('/orders', (req, res) =>{

Order.findAll().then((result) =>{
    res.status(200).send(result)
}).catch((err) =>{
    res.status(500).send(err)
})
})

app.post('/orders', (req, res) =>{

    let orderData = req.body

    Order.create(orderData).then((result)=>{
        res.status(200).send(result)

    }).catch((err)=>{
        res.status(500).send(err)
    })
})

app.get('/order/:o', (req, res) =>{
    let o = parseInt(req.params.o)

    Order.findByPk(o).then((result) =>{
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
})
app.patch("/order/:o_id", function (req, res) {
    const o_id = parseInt(req.params.o_id);
    let oData = req.body;
  
    Order.findByPk(o_id)
      .then(function (result) {
        if (!result) {
          res.status(404).send("o_id not found");
          return;
        }
  
        result.status = oData.status;
  
        result
          .save()
          .then(function () {
            res.status(200).send(result);
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  });

/// catagories route

app.get('/categories', (req, res) =>{

    Category.findAll().then((result) => {
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
     
})

app.get('/categories/:category_id', (req, res) =>{
    let category_id = parseInt(req.params.category_id)

    Category.findByPk(category_id).then((result) =>{
        res.status(200).send(result)
    }).catch((err) =>{
        res.status(500).send(err)
    })
})


///Post review
app.post('/reviews', (req , res) => {
    let rData = req.body

    Review.create(rData).then((result)=>{
        res.status(200).send(result)        

    }).catch((err)=>{
        res.status(500).send(err)
    })
})

//get all reviews
app.get('/reviews', (req, res) => {

   

    Review.findAll().then((result) => {
        res.status(200).send(result)

    }).catch((err) => {
        res.status(500).send(err)
    })
})
app.get('/reviews/desc', (req, res) => {

    Review.findAll({
        order: [['id', 'DESC']],
        include: Clothe
        
    })
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});
//filter reviews 
app.get('/reviews/clothes', (req, res) => {
    let rData = {
        where: {},
        include: Clothe
    }

    if(req.query.clothes_id !== undefined){
        rData.where.clothes_id = req.query.clothes_id
    }

    console.log(req.query.clothes_id)
    
    Review.findAll(rData).then((result) => {
        res.status(200).send(result)

    }).catch((err) => {
        res.status(500).send(err)
    })
})

//


app.listen(3000, () => {
    console.log('Server running on port 3000...');
});