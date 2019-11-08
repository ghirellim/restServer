//puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento Token de un mes
// Minutos
// Segundos
// Horas
// Dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//Seed de autenticacion (Semilla)

process.env.SEED = process.env.SEED || 'secret-desarrollo'



//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//CLIENT ID GOOGLE
process.env.CLIENT_ID = process.env.CLIENT_ID || '332344273630-r8ir4mnmgvv7iqeppf3jgfrm4g9gnm0v.apps.googleusercontent.com';