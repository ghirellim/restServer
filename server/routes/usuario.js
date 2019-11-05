const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();
//se implementa recurso con validacion token
app.get('/usuario', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    Usuario.find({ estado: true }, 'nombre email role google estado img')
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, totalRegistros) => {
                res.json({
                    ok: true,
                    registros: totalRegistros,
                    usuarios
                });

            });
        });
});

// app.get('/usuario', function(req, res) {
//     let desde = req.query.desde || 0;
//     let limite = req.query.limite || 5;
//     Usuario.find({ estado: true }, 'nombre email role google estado img')
//         .skip(Number(desde))
//         .limit(Number(limite))
//         .exec((err, usuarios) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             Usuario.countDocuments({ estado: true }, (err, totalRegistros) => {
//                 res.json({
//                     ok: true,
//                     registros: totalRegistros,
//                     usuarios
//                 });

//             });
//         });
// });
/* app.post('/usuario', function(req, res) {
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
 */
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // Alternativa para ofuscar datos sensibles
        //  usuarioDB.password = '***********';

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


});

app.put('/usuario/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});

app.delete('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    //eliminamos el registro fisicamente de la base de datos.

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(204).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
});

module.exports = app;