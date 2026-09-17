# 🏢 MyResidential

**MyResidential** es una plataforma PropTech para la gestión de comunidades residenciales, diseñada para **administradores de fincas y vecinos**.

El proyecto parte de un caso ficticio, **Urbalia Gestión de Fincas**, una administradora que gestiona 120 comunidades.

## 🎯 Objetivo

Centralizar la información de las comunidades y utilizar los datos para facilitar su gestión.

El administrador puede consultar comunidades, gastos, proveedores, contratos e incidencias, además de comparar el **gasto por vivienda entre comunidades similares** mediante benchmarking.

Los vecinos disponen de un portal para consultar información, comunicar incidencias, realizar reservas y acceder al tablón de anuncios.

## 🛠️ Tecnologías

**Python · Pandas · SQL · Azure SQL · Next.js · JavaScript · CSS · Vercel**

## 🌐 Probar la aplicación

La aplicación está desplegada en Vercel:

https://my-residential.vercel.app/

También puede ejecutarse en local:

```bash
git clone https://github.com/contactodiegovega/MyResidential.git
cd MyResidential/myresidential
npm install
npm run dev
```

Después abre:

```text
http://localhost:3000
```

> Algunas funcionalidades requieren las variables de entorno de Azure SQL, que no se incluyen en el repositorio por seguridad.

## 📊 Arquitectura

**Datos sintéticos → Python/Pandas → Azure SQL → Next.js → Vercel**

Proyecto desarrollado durante el **Bootcamp de Data & IA de Upgrade Hub**.