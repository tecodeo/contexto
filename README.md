# Contexto - Juego de Palabras

Contexto es un juego de palabras inspirado en el popular juego Contexto, donde los jugadores deben adivinar una palabra secreta basándose en la proximidad semántica de sus intentos.

## Características

- **Autenticación de Usuarios**: Registro e inicio de sesión seguros
- **Creación de Partidas**: Crea partidas con palabras personalizadas o aleatorias
- **Juego en Tiempo Real**: Recibe feedback inmediato sobre la proximidad de tus intentos
- **Clasificación Global**: Compite con otros jugadores y sube en la clasificación
- **Diseño Responsivo**: Juega desde cualquier dispositivo

## Tecnologías Utilizadas

- **Frontend**: React, Framer Motion, React Router
- **Backend**: Firebase (Autenticación, Firestore, Realtime Database)
- **IA**: OpenAI API para cálculo de similitud semántica
- **Estilos**: CSS personalizado con temas

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tecodeo/contexto.git
cd contexto
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Configuración

El proyecto utiliza Firebase para la autenticación y la base de datos en tiempo real. La configuración de Firebase ya está incluida en el código.

Para la API de OpenAI, necesitarás configurar tu propia clave API. Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
VITE_OPENAI_API_KEY=tu_clave_api_aqui
```

> **Importante**: Nunca compartas tu clave API ni la incluyas en el control de versiones.

## Estructura del proyecto

- `/src/components`: Componentes de React organizados por funcionalidad
- `/src/contexts`: Contextos para gestión de estado global
- `/src/services`: Servicios para interactuar con Firebase y OpenAI
- `/src/pages`: Páginas principales de la aplicación

## Despliegue

El proyecto está configurado para ser desplegado en Vercel o Netlify. Simplemente conecta tu repositorio de GitHub a cualquiera de estas plataformas y configura las variables de entorno necesarias.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios que te gustaría realizar.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.
