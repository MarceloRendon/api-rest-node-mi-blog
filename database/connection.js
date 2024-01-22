const mongoose = require("mongoose")
//Conexión local
//mongodb://127.0.0.1:27017/mi_blog

//Conexión atlas
//mongodb+srv://mrendondemelo:<password>@cluster0.fdndmue.mongodb.net/mi_blog
//Username: mrendondemelo
//Password: 1Q4Wt60bwdetmDHr


const connection = async () => {
    try{
        await mongoose.connect("mongodb+srv://mrendondemelo:1Q4Wt60bwdetmDHr@cluster0.fdndmue.mongodb.net/mi_blog")

        console.log("Conectado correctamente a la base de datos")

    }catch(error){
        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}

module.exports = {
    connection
}