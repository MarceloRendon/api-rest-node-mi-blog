const validator = require("validator")

const validarArticulo = (parametros) => {

    // Validar parametros de artículo usando librería validator

    
        let validar_titulo = !validator.isEmpty(parametros.title) && validator.isLength(parametros.title, {min: 0, max: undefined})
        let validar_contenido = !validator.isEmpty(parametros.content)

        if(!validar_titulo || !validar_contenido){
            throw new Error("No se ha validado la información!")
        }

}

module.exports = {
    validarArticulo,
}