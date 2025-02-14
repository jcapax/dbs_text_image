const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Configuración de Multer para guardar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        // Crear la carpeta si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const productName = req.body.productName || 'default'; // Evitar errores si no hay nombre
        const ext = path.extname(file.originalname);
        cb(null, `${productName}${ext}`);
    },
});

const upload = multer({ storage });

// Función para generar un archivo de log
function generateLog(fileName) {
    const logDir = './logs'; // Carpeta donde se guardarán los logs
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-'); // Formato: YYYY-MM-DDTHH-mm-ss-SSS
    const logFileName = `${timestamp}.log`; // Nombre del archivo de log
    const logFilePath = path.join(logDir, logFileName);

    // Crear la carpeta "logs" si no existe
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Contenido del log
    const logContent = `Archivo cargado: ${fileName}\nFecha y hora: ${now.toLocaleString()}\n\n`;

    // Escribir el contenido en el archivo de log
    fs.appendFileSync(logFilePath, logContent, (err) => {
        if (err) {
            console.error('Error al escribir el archivo de log:', err);
        }
    });

    console.log(`Log generado: ${logFilePath}`);
}

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('productImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
    }

    const productName = req.body.productName;
    const fileName = req.file.filename;

    // Generar un log con el nombre del archivo cargado
    generateLog(fileName);

    res.status(200).json({ message: `Imagen guardada como "${fileName}"`, fileName });
});

// Servir el archivo index.html en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configurar la carpeta pública para servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});