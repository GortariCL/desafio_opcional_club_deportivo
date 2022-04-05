const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;

http.createServer((req, res) => {
    const deportesJSON = JSON.parse(fs.readFileSync('deportes.json', 'UTF8'));
    const deportes_arr = deportesJSON.deportes;

    //Disponibilizar Index HTML
    if (req.url == '/' && req.method == 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.end(fs.readFileSync('index.html', 'UTF8'));
    }
    //Ruta para registrar deporte y precio (Requerimiento 1)
    if (req.url.startsWith('/agregar')) {
        const { nombre, precio } = url.parse(req.url, true).query;
        let deporte = {
            nombre: nombre,
            precio: precio,
        }
        deportesJSON.deportes.push(deporte);
        res.end(fs.writeFileSync('deportes.json', JSON.stringify(deportesJSON)));
    }
    //Ruta para obtener todos los deportes registrados (Requerimiento 2)
    if (req.url == '/deportes') {
        fs.readFile('deportes.json', 'UTF8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            }
        });
    }
    //Ruta para editar deporte y precio (Requerimiento 3)
    if (req.url.startsWith('/editar')) {
        const { nombre, precio } = url.parse(req.url, true).query;
        deportesJSON.deportes = deportes_arr.map((d) => {
            if (d.nombre == nombre) {
                let deporte = {
                    nombre: nombre,
                    precio: precio,
                }
                return deporte;
            }
            return d;
        });
        res.end(fs.writeFileSync('deportes.json', JSON.stringify(deportesJSON)));
    }
    //Ruta para eliminar deporte (Requerimiento 4)
    if (req.url.startsWith('/eliminar')){
        const { nombre } = url.parse(req.url, true).query;
        deportesJSON.deportes = deportes_arr.filter((d) => d.nombre !== nombre);
        res.end(fs.writeFileSync('deportes.json', JSON.stringify(deportesJSON)));
    }

}).listen(port, () => console.log(`Server on => ${port}`));