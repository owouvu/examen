require('dotenv').config(); // Carga variables de entorno
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración para servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); // Asegúrate de que home.html esté en tu directorio
});

// Ruta para servir el clima.html
app.get('/buscador', (req, res) => {
    res.sendFile(path.join(__dirname, 'clima.html')); // Cambia el nombre del archivo según tu estructura
});

// Ruta para obtener datos del clima desde la API
app.get('/api/clima/:ciudad', async (req, res) => {
    const ciudad = req.params.ciudad;
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    console.log("Ciudad solicitada:", ciudad); // Para depuración
    console.log("URL generada:", url);

    try {
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            ciudad: data.name,
            temperatura: data.main.temp,
            descripcion: data.weather[0].description,
            humedad: data.main.humidity,
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error.message);
        res.status(error.response?.status || 500).json({
            mensaje: "Error al obtener los datos del clima",
            error: error.message,
        });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
