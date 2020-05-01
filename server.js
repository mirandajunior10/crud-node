const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mirandajunior:310396@cluster0-ndbuh.mongodb.net/test?retryWrites=true&w=majority"

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

mongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud-node') // coloque o nome do seu DB

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        console.log(results)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})