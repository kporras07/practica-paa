# PAA - Prueba de Aptitud Académica

Una aplicación web para practicar la Prueba de Aptitud Académica (PAA) con preguntas de habilidades matemáticas y verbales.

## Características

- **Práctica personalizada**: Elige entre habilidades matemáticas, verbales o ambas
- **Preguntas configurables**: Selecciona cuántas preguntas quieres resolver (1-50)
- **Resultados detallados**: Revisa tus respuestas con explicaciones completas
- **Historial local**: Guarda automáticamente tus últimos 10 resultados
- **Reporte de errores**: Reporta preguntas problemáticas directamente a GitHub

## Uso

### Con Docker (Recomendado)

```bash
docker-compose up -d
```

La aplicación estará disponible en https://kporras07.github.io/practica-paa/

### Servidor local

Sirve los archivos con cualquier servidor web estático:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

## Estructura del proyecto

```
.
├── index.html          # Página principal
├── app.js             # Lógica de la aplicación
├── styles.css         # Estilos CSS
├── questions.json     # Base de datos de preguntas
├── docker-compose.yml # Configuración Docker
└── Dockerfile         # Imagen Docker
```

## Desarrollo

### Agregar preguntas

Edita el archivo `questions.json` con la siguiente estructura:

```json
{
  "math": [
    {
      "id": 1,
      "question": "Tu pregunta aquí",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correct": 0,
      "explanation": "Explicación de la respuesta correcta"
    }
  ],
  "verbal": [
    // Similar estructura para preguntas verbales
  ]
}
```

### Contribuir

1. Fork el repositorio
2. Crea una rama para tus cambios
3. Agrega tus preguntas o mejoras
4. Envía un pull request

## Reportar problemas

Si encuentras algún error en las preguntas, usa el botón "Reportar pregunta" durante la práctica para crear automáticamente un issue en GitHub.

## Licencia

Este proyecto está bajo la Licencia MIT.