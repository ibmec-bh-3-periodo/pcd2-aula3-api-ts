// const express = require("express")
import express, {Request, Response} from "express"
import data from "./data.json"

const server = express();

// Filtrando todos os filmes de Romance
server.get("/estacoes", (req: Request, res: Response) => {
    const consulta = req.query.genero;
    return data.filter((data)=> data.genero === "Romance", {
    })

})

server.listen(5000)