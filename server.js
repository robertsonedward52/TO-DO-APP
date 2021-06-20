let express = require('express');
// require the mongodb package after installing mongodb
let mongodb = require('mongodb')

let app = express();

// define a dbase varible
let db


app.use(express.static('public'))

let connectString = 'mongodb+srv://todoAppUser:edward1996@cluster0.x8oqf.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectString, {useNewUrlParser: true}, function(err, client) {
  db = client.db()
  app.listen(3000)
})


app.use(express.json())
app.use(express.urlencoded({extended: false}))


// password encrytion
function passwordProtected(req, res, next) {
   res.set('WWW-Authenticate', 'Basic realm="Simple Todo app"')
  
   console.log(req.headers.authorization)
   if(req.headers.authorization == 'Placeholder') {
    next()
   } else {
    res.status(401).send('Authenciation required')
   }
}

app.get('/', passwordProtected, function(req, res) {

  // reading data from db
  db.collection('items').find().toArray(function(err, items) {
    //console.log(items)

    res.send(`
    
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form action='/create-item' method='POST' id='create-form'>
        <div class="d-flex align-items-center">
          <input id='create-field' name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul class="list-group pb-5" id='item-list'>
     
    </ul>
    
  </div>

  
 <script>
 let items = ${JSON.stringify(items)}
 </script>

 <script src='/browser.js'></script>
 <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
 
</body>
</html>

    `)
  })

    
})

app.post('/create-item', function(req, res) {
   // console.log(req.body.item)
   db.collection('items').insertOne({text: req.body.text}, function(err, info) {
    res.json(info.ops[0])
   })
    
})

app.post('/update-item', function(req, res) {
  //console.log(req.body.text)
//res.send('Success')
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
    res.send('Success')
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
    res.send('You have successfully deleted one item.')
  })
})

