const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID
const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mirandajunior:310396@cluster0-ndbuh.mongodb.net/test?retryWrites=true&w=majority"

const app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }))
    //app.use(bodyParser.json());
    //app.use(expressValidator());

mongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud-node') // coloque o nome do seu DB
    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.set('view engine', 'ejs')



app.route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
    .get(function(req, res) {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
                //console.log(results)
            res.render('home.ejs', { data: results })
        })
    })
    .post(async(req, res) => {
        db.collection('data').save(req.body, (err, result) => {
            if (err) return console.log(err)
            console.log('Salvo no Banco de Dados')
            db.collection('data').find().toArray((err, results) => {
                if (err) return console.log(err)
                res.render('home.ejs', { data: results })
            })


        })
    })


app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id
        db.collection('data').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit.ejs', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var surname = req.body.surname
        console.log(req.body)
        db.collection('data').updateOne({ _id: ObjectId(id) }, {
            $set: req.body,

        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/')
            console.log('Atualizado no Banco de Dados')
        })
    })

app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('data').deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Deletado do Banco de Dados!')
            res.redirect('/')
        })
    })