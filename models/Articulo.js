const { Schema, model } = require("mongoose")

const ArticuloSchema = Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: {type: Date, default: Date.now},
    img: {type: String, default: "default.png"}
})

//nombre del modelo, esquema del modelo y --> la colección a la que pertenece <-- (parte opcional dado que lo puede hacer automáticamente)
module.exports = model("Articulo", ArticuloSchema, "articulos")