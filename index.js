import express from 'express';
import http from 'http'
import os from 'os';
import {read, write} from './src/utils/files.js';
import { nextTick } from 'process';




const app = express();


app.use(express.json());




//obtener todas las motos
app.get('/motos', (req, res) => {
    console.log('os.cpus()', os.cpus());
    const motos = read();
    console.log('motos', motos);
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(motos));
})


//obtener moto por id
app.get('/motos/:id', (req, res) => {
    const motos = read(); // Leer todas las motos
    const motoId = parseInt(req.params.id); // Obtener el id de los parámetros y convertirlo a número

    const moto = motos.find(m => m.id === motoId); // Buscar la moto por id
    console.log('motos', motos);
    if (moto) {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(moto)); // Devolver la moto encontrada
    } else {
        res.status(404).send({ error: 'Moto no encontrada' }); // Si no se encuentra, enviar 404
    }
});


//agregar moto
app.post('/motos', (req,res) => {
    const motos = read();
    const nuevamoto = req.body, id = motos.length + 1;
    motos.push(nuevamoto);
    write(motos);
    res.status(201).json(motos);
})


//actualizar moto
app.put('/motos/:id', (req, res) => {
    const motos = read();
    let moto = motos.find(moto => moto.id === parseInt(req.params.id));
   
    if (moto){
        //actualizar task
        moto={
        ...moto,
        ...req.body
    }
    //actualizar taks en el array
        motos[
        motos.findIndex(moto => moto.id === parseInt(req.params.id))
            ] = moto;
   write(motos);
    res.json(moto);
    }else{
        res.status(404).end();
    }   
})



//eliminar moto
app.delete('/motos/:id', (req, res) => {
    const motos = read();
    const moto = motos.find(moto => moto.id === parseInt(req.params.id));
    
    if (moto){
        motos.splice(
            motos.findIndex(moto => moto.id === parseInt(req.params.id)),
            1
        );
        write(motos);
        res.json(moto);
    }else{
        res.status(404).end();
    }
})




app.listen(3000, () => {
    console.log("serever is running on port 3000")
})