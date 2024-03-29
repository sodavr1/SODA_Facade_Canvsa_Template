// Import required modules using ES6 import syntax
import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import {createServer} from 'http';
const __dirname = path.resolve();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
// import p5 from 'p5'

// // load P5
// const p5 = require('p5');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }});

httpServer.listen(PORT);
// Serve static files from the 'public' folder
app.use(express.static("public"));
app.get('/download', (req, res) => {
    const directoryPath = path.join(__dirname, 'examples'); // Path to your directory

    const zipFileName = 'example.zip';
    const zipFilePath = path.join(__dirname, zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.download(zipFilePath, zipFileName, (err) => {
            if (err) {
                res.status(500).send('Error downloading the zip file');
            }
            fs.unlinkSync(zipFilePath); // Remove the zip file after download
        });
    });

    archive.pipe(output);
    archive.directory(directoryPath, false);
    archive.finalize();
});
