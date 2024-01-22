const express = require("express")
const router = express.Router()
const multer = require("multer")
const ArticuloController = require("../controllers/ArticuloController")
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagenes/articulos/')

    },

    filename: function(req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname)

    }
})

const subidas = multer({storage: almacenamiento})

// Rutas de prueba
router.get("/ruta-de-prueba", ArticuloController.prueba)
router.get("/mensaje", ArticuloController.mensajePrueba)

// Rutas funcionales
router.post("/crear", ArticuloController.crear)
router.get("/all/:ultimos?", ArticuloController.obtenerArticulos)
router.get("/one/:id", ArticuloController.obtenerUnArticulo)
router.delete("/one/:id", ArticuloController.borrar)
router.put("/one/:id", ArticuloController.actualizar)
router.post("/subir-imagen/:id",[subidas.single("file0")], ArticuloController.subir)
router.get("/imagen/:fichero", ArticuloController.imagen)
router.get("/buscar/:busqueda", ArticuloController.buscar)


module.exports = router;