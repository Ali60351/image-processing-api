import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const fetchImage = (req: express.Request, res: express.Response) => {
    const filePath = 'images/encenadaport.jpg';

    fs.open(filePath, 'r').then(fileHandler => {
        fileHandler.readFile().then(file => {
            res.status(200);
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `filename: ${path.basename(filePath)}`);
            res.send(file);

            fileHandler.close();
        });
    });
};
