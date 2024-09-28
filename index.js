const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
var AdmZip = require("adm-zip");

http.createServer((req, res) => {
    if (req.method === 'POST') {
        // Initialize formidable to handle multipart form data
        const form = new formidable.IncomingForm();
        
        // Parse the incoming form data
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing the form:', err);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error parsing form data');
                return;
            }

            // Access the uploaded file
            const file = files.report; // 'file' is the field name in Postman form-data
            
            if (!file) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No file uploaded.');
                return;
            }

            // Handle different versions of `formidable`: `filepath` (new) or `path` (old)
            const filePath = file[0].filepath;
            console.log('Uploaded file path:', filePath);
            const extractDir = path.join(__dirname, 'reports');

            // Create the directory for extracted files if it doesn't exist
            if (!fs.existsSync(extractDir)) {
                fs.mkdirSync(extractDir);
            }

            var zip = new AdmZip(filePath);
            const extractPath = path.join(extractDir, file[0].originalFilename);

            // Unzip the uploaded file
            zip.extractAllTo(extractPath, /*overwrite*/ true);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File uploaded and extracted successfully.');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
