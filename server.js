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

app.route('/')
    .get(function(req, res) {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
            results.forEach(element => {

                element.birthDate = element.birthDate.substring(8, 10) + '/' +
                    element.birthDate.substring(5, 7) + '/' +
                    element.birthDate.substring(0, 4);

                element.CPF = element.CPF.substring(0, 3) + '.' +
                    element.CPF.substring(3, 6) + '.' +
                    element.CPF.substring(6, 9) + '-' +
                    element.CPF.substring(9, 11);

                element.rg = element.rg.substring(0, 2) + '.' +
                    element.rg.substring(2, 5) + '.' +
                    element.rg.substring(5, 8) + '-' +
                    element.rg.substring(8, 10);
            });
            res.render('home.ejs', { data: results })
        })
    })

app.route('/save')

.post(async(req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/');
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