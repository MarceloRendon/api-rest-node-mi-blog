const {connection} = require("./database/connection");
const express = require ("express");
const cors = require("cors")
const routerApi = require("./routes")

// Inicializar app
console.log("App de node funcionando")

// Conectar a la base de datos
connection()

// Crear servidor Node
const app = express()
const puerto = 3900;
// Configurar cors
app.use(cors());

// Convertir body a json
app.use (express.json()) //  Recibir datos con content-type app/json
app.use(express.urlencoded({extended: true})) // Convertir cada propiedad de x-www-form-urlencoded a un objeto json

// Rutas

routerApi(app);

app.get("/", (req, res) =>{
    res.send({
        message: "Hello World with Express"}
        );
  });

app.get("/probando", (req, res) => {
    return res.status(200).send({
        message: "Probando el endpoint"
    })
})



// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${puerto}`);
})