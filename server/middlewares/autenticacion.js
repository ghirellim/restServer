const jwt = require('jsonwebtoken');
// ==================
// Verifica token
// ==================

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssaje: "token no valido"
                }

            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ==================
// Verifica Admin Role
// ==================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else
        return res.status(401).json({
            ok: false,
            err: {
                menssaje: "Requiere permisos de administrador."
            }

        });
};


module.exports = {
    verificaToken,
    verificaAdminRole
}