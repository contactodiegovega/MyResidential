# 🏢 MyResidential

**MyResidential** es una plataforma PropTech desarrollada para ayudar a administradores de fincas a centralizar la información de sus comunidades y convertir los datos de gestión en información útil para la toma de decisiones. Para los vecinos, ofrece un espacio desde el que consultar información de su comunidad, comunicar incidencias, realizar reservas y participar en el tablón de anuncios.

El proyecto parte de un caso de uso ficticio: **Urbalia Gestión de Fincas**, una administradora que gestiona 120 comunidades residenciales.

## 🎯 Objetivo

El principal problema abordado es la dificultad para saber si el gasto de una comunidad es elevado cuando se analiza de forma aislada.

MyResidential crea un sistema de **benchmarking entre comunidades comparables**, permitiendo detectar desviaciones de gasto y analizar qué categorías están detrás de ellas.

Además, incluye un portal para vecinos desde el que pueden consultar información de su comunidad, realizar reservas, comunicar incidencias y publicar anuncios.

## 🛠️ Tecnologías

- **Python / Pandas** — generación, tratamiento y análisis de datos
- **SQL / Azure SQL Database** — modelo relacional y almacenamiento
- **Next.js / JavaScript / CSS** — aplicación web
- **Microsoft Azure** — infraestructura de datos y autenticación
- **Vercel** — despliegue de la aplicación
- **Git / GitHub** — control de versiones

## 📊 Datos y funcionalidades

El proyecto utiliza un **dataset sintético** que simula la operativa de 120 comunidades residenciales: gastos, proveedores, contratos, incidencias, viviendas y reservas.

La plataforma incluye:

- Dashboard para administradores
- Benchmarking de gasto por vivienda
- Detección de desviaciones frente a comunidades comparables
- Análisis de gasto por categorías
- Gestión de incidencias, contratos y proveedores
- Portal independiente para residentes
- Reservas y tablón de anuncios
- Integración de la aplicación con Azure SQL

## 🧠 Enfoque Data Science

El análisis mostró importantes diferencias de gasto entre comunidades, haciendo poco representativa una comparación basada únicamente en la media global.

Por ello se desarrolló un benchmark contextual basado en características similares de las comunidades, utilizando la **mediana del grupo comparable** como referencia para identificar desviaciones que requieren revisión.

> Proyecto desarrollado como parte de un Bootcamp de Data Analytics & IA.