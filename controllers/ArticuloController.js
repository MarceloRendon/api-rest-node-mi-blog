const validator = require("validator")
const fs = require("fs")
const Articulo = require("../models/Articulo")
const {validarArticulo} = require("../helpers/validar")
const path = require("path")
const prueba = (req, res) => {

    return res.status(200).json({
        message: "Soy una acción de prueba en mi controlador de artículos"
    })
}

const mensajePrueba = (req, res) => {
 
        return res.status(200).send({
            message: "Probando el endpoint mensaje de articulo"
        })

}


// Método que crea un articulo obteniendo los parámetros del body y lo almacena en MongoDB
const crear = (req, res) => {


    // Obtener los parametros por post para guardar
    let parametros = req.body;

    // Validar los datos con libreria validator
    try{
        let validar_titulo = !validator.isEmpty(parametros.title) && validator.isLength(parametros.title, {min: 0, max: undefined})
        let validar_contenido = !validator.isEmpty(parametros.content)

        if(!validar_titulo || !validar_contenido){
            throw new Error("No se ha validado la información!")
        }

    }catch(error){
        return res.status(400).json({
            status: "error",
            message: 'Faltan datos por enviar'
        })
    }

    // Crear el objeto a guardar y asignar los parametros enviados al objeto 
    const articulo = new Articulo(parametros)

    // Asignar valores a objeto basado en el modelo
    // Manual
    // articulo.title = parametros.title
    // articulo.content = parametros.content}


    // Guardar articulo en la base de datos
    articulo.save()
        .then((articuloGuardado) => {
            return res.status(200).json({
                status: 'success',
                Articulo: articuloGuardado,
                mensaje: 'Articulo creado con exito'
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el articulo: ' + error.message
            });
        });

}


// Método que obtiene los artículos de la base de datos
const obtenerArticulos = (req, res) => {

    let consulta = Articulo.find({}).sort({date: -1})
                        //Obtener un limite de la cantidad de articulos a mostrar
                        if(req.params.ultimos){
                            consulta=consulta.limit(parseInt(req.params.ultimos))
                        }

        consulta.then((articulos) => {

        if (!articulos) {
            //Si no existen los articulos
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos",
            });

        }
        //Si existen articulos
        return res.status(200).send({
        status: "success",
        parametro: req.params.ultimos,
        contador: articulos.length,
        articulos,
        });

        })
        .catch((error) => {

            return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al obtener los articulos",
            error: error.message,
            });
        
        });
}


const obtenerUnArticulo = (req, res) => {
    // Obtener id por url
    let id = req.params.id;

    // Buscar el artículo 
    let consulta = Articulo.findById(id)

    consulta.then((articulo) => {

        if (!articulo) {
            //Si no existe el articulo
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado el articulo",
            });

        }
        //Si existe articulo
        return res.status(200).json({
        status: "success",
        articulo
        });

        })
        .catch((error) => {

            return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al obtener el articulo",
            error: error.message,
            });
        
        });
}


// Método borrar

const borrar = (req,res) => {

    let articulo_id = req.params.id;

    let consulta = Articulo.findOneAndDelete({_id : articulo_id})

    consulta.then((articuloBorrado) => {

        if (!articuloBorrado) {
            //Si no existe el articulo
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado el articulo",
            });
        }

        //Si existe articulo, se borra
        return res.status(200).json({
        status: "success",
        articulo: articuloBorrado,
        message: "Artículo borrado"
        });

        })
        .catch((error) => {

            return res.status(500).json({
            status: "error",
            message: "Ha ocurrido un error al borrar el articulo",
            error: error.message,
            });
        
        });

}


// actualizar artículo

const actualizar = (req,res) => {

    let articulo_id = req.params.id;

    // Obtener datos de body

    let parametros = req.body;

    // Validar datos de body
    try {
        validarArticulo(parametros)
    }
    catch(error){
        return res.status(400).json({
            status: "error",
            message: 'Faltan datos por enviar'
        })
    }




    // // Buscar y actualizar
    // let articuloOld = Articulo.findById(id)

    // // Crear el objeto a guardar y asignar los parametros enviados al objeto 
    // const articuloNew = new Articulo(parametros)

    // // Reemplazar valores de articuloOld con articuloNew
    // articuloOld = articuloNew

    // // Guardar articulo en la base de datos y devolver respuesta
    //     articuloOld.save()
    //         .then((articuloGuardado) => {
    //             return res.status(200).json({
    //                 status: 'success',
    //                 Articulo: articuloGuardado,
    //                 mensaje: 'Articulo actualizado con exito'
    //             });
    //         })
    //         .catch((error) => {
    //             return res.status(400).json({
    //                 status: 'error',
    //                 mensaje: 'No se ha actualizado el articulo: ' + error.message
    //             });
    //         });

    
    // Forma alternativa
    // obtener el artículo por id y actualizar enviando los parámetros nuevos, almacenándolos en articulo_actualizado
    let articulo_actualizado = Articulo.findOneAndUpdate({ _id : articulo_id }, parametros, {new: true})

    articulo_actualizado.then((articulo_nuevo) => {

        if (!articulo_nuevo) {
            //Si no existe el articulo a actualizar
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado el articulo",
            });
        }

        //Si existe articulo, se actualiza
        return res.status(200).json({
        status: "success",
        articulo: articulo_nuevo,
        message: "Artículo actualizado"
        });

        })
        .catch((error) => {

            return res.status(500).json({
            status: "error",
            message: "Ha ocurrido un error al actualizar el articulo",
            error: error.message,
            });
        
        });

}


// Método para subir imagen

const subir = (req, res) => {

        // Configurar multer --> (configurado en ArticuloRouter.js)

        // Obtener el fichero de la imagen subido
        //console.log(req.file)

        //Comprobar que siempre se mande el archivo
        if(!req.file && !req.files){
            return res.status(404).send('No file was sent');
        }

        // Nombre del archivo
        let archivo = req.file.originalname
        // Extensión del archivo
        let archivo_split = archivo.split("\.")
        //console.log(archivo_split)
        let archivo_extension = archivo_split[archivo_split.length -1]
        //console.log(archivo_extension)

        // Comprobar extensión correcta
        if(archivo_extension != "png" && archivo_extension != "jpg" && archivo_extension != "jpeg" && archivo_extension != "gif"){
            // Borrar archivo y dar respuesta
            fs.unlink(req.file.path, (error) => {
                return res.status(400).json({
                    status: "error",
                    message: "Imagen inválida"
                })
            })

        }else{

            // Obtener id articulo
            let articulo_id = req.params.id;

            // // Buscar y actualizar
            // obtener el artículo por id y actualizar enviando los parámetros nuevos, almacenándolos en articulo_actualizado
            let articulo_actualizado = Articulo.findOneAndUpdate({ _id : articulo_id }, {img: req.file.filename }, {new: true})
        
            articulo_actualizado.then((articulo_nuevo) => {
        
                if (!articulo_nuevo) {
                    //Si no existe el articulo a actualizar
                    return res.status(404).json({
                        status: "error",
                        message: "No se han encontrado el articulo",
                    });
                }
        
                //Si existe articulo, se actualiza
                return res.status(200).json({
                status: "success",
                articulo: articulo_nuevo,
                message: "Artículo actualizado",
                fichero: req.file,
                });
        
                })
                .catch((error) => {
        
                    return res.status(500).json({
                    status: "error",
                    message: "Ha ocurrido un error al actualizar el articulo",
                    error: error.message,
                    });
                
                });

        }

}


// Mostrar imagen
const imagen = (req, res) => {

    //fichero corresponde al nombre del archivo almacenado en imagenes/articulos
    //se envía ese nombre como parametro get

    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe) {
            //Mostrar imagen
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            });
        }
    })

}

// Buscador de articulos
const buscar = async (req, res) => {
    try {
        // Sacar el string de busqueda
        let busqueda = req.params.busqueda
        //buscar articulos que coincidan con el parametro enviado de búsqueda
        // find por title y/o content que coincida con el parametro de búsqueda, ordenando por fecha
        let articulos = await Articulo.find({
            "$or": [
                { "title": { "$regex": busqueda, "$options": "i" } },
                { "content": { "$regex": busqueda, "$options": "i" } }
            ]
        }).sort({ fecha: -1 }).exec()

        // Devolución de respuesta
 
        if (!articulos || articulos.length < 1) {
 
            return res.status(404).json({
                status: "error",
                mensaje: "No hay articulos que coincidan"
            })
        }
        return res.status(200).json({
            status: "success",
            articulos
        })
        // Devolver resultados 
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "Fallo la algo a la hora de realizarla busqueda "
        })
    }
}








module.exports = {
    prueba,
    mensajePrueba,
    crear,
    obtenerArticulos,
    obtenerUnArticulo,
    borrar,
    actualizar,
    subir,
    imagen,
    buscar
}