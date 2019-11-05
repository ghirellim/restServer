require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuracion de rutas
app.use(require('./routes/index'));

app.get('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            descripcion: 'El nombre es necesario!!'
        })
    } else
        res.json({
            persona: body
        });
})



//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos Online");
    });

app.listen(process.env.PORT, () => {
    console.log('Ecuchando en el puerto: ', process.env.PORT);
    console.log('Conectado a mongo:', process.env.URLDB);
});