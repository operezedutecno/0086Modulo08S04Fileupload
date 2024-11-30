const express = require("express");
const path = require("path");
const fs = require("fs");
const fileupload = require("express-fileupload");
const { v4: uuid } = require("uuid");
const app = express();
const port = 3000;

app.use(express.json());
app.use(fileupload({ createParentPath: true }));

app.use("/public", express.static(`${__dirname}/public`));

app.listen(port, () => console.log(`Aplicación en ejecución, por el puerto ${port}`));

app.get("/", (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`)
})

const imgPublic = `${__dirname}/public/images`;

app.post("/registro", async (request, response) => {
    console.log(request.body);
    console.log(request.files);

    if(request.files) {
        const archivo = request.files.foto;
        const filename = uuid();
        const { ext } = path.parse(request.files.foto.name);

        if(archivo.size > 5_000_000) {
            return response.status(422).json({ message: "El archivo excede los 5MB"});
        }
        
        if(archivo.mimetype != "image/jpg" && archivo.mimetype != "image/jpeg" && archivo.mimetype != "image/png") {
            return response.status(422).json({ message: "Subir un archivo png o jpg"});
        }

        await archivo.mv(`${__dirname}/public/images/${filename}${ext}`);
    }
    response.json({ message: "Registro exitoso"});
})

app.get("/imagenes", (request, response) => {
    const imagenes = fs.readdirSync(imgPublic);
    response.json({ message: "Listado de imágenes", data: imagenes });
})

app.delete("/imagenes/:nombre", (request, response) => {
    if(!fs.existsSync(`${imgPublic}/${request.params.nombre}`)) {
        return response.status(404).json({ message: "La imagen no existe"});
    }
    fs.unlinkSync(`${imgPublic}/${request.params.nombre}`)
    response.json({ message: "Eliminación exitosa"});
})