/**
 * Punto de partida de la aplicación
 * creamos el servidor utilizando Express
 */

const express = require('express')
const dotenv = require('dotenv').config()

const app = express()
const puerto = process.env.PUERTO

app.use(express.static('public_html'))

app.use('*',(req, res) => {
    res.send('Página no encontrada')
})

app.listen(puerto, () => {
    console.log(`Servidor en marcha en el puerto: ${puerto}`)
})