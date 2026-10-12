# 🌹 L´Aura | Haute Parfumerie Landing Page

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Adaptable-success?style=for-the-badge)

Una landing page inmersiva de una sola página para una perfumería de alta gama, desarrollada con **Vanilla JavaScript, CSS3 moderno y HTML5**. Cada sección tiene su propia *aura*: el fondo cambia de color al recorrer la página, con scroll propio, animaciones de entrada y una estética oscura y elegante.

[🔗 Ver Demo en Vivo](https://karmrls.github.io/proyecto-perfumes/)

</div>

---

## 🌟 Características Principales

* **🎨 Auras de Color por Sección:** El fondo cambia de color con transiciones suaves según la sección visible: cereza, ámbar, rosa, amatista y verde. Al pasar el cursor sobre cada familia olfativa del catálogo, el fondo adopta su propia paleta.
* **🖱️ Scroll Propio:** Desplazamiento suave con inercia, barra de scroll personalizada que cambia de color, barra de progreso e indicador lateral de secciones.
* **✨ Animaciones de Entrada:** Título que aparece letra por letra, títulos que suben palabra por palabra, una botella de perfume que se dibuja sola, efecto parallax y un halo de luz que sigue al cursor.
* **🧭 Navegación Tipo Menú:** Navbar de cristal esmerilado que resalta la sección activa y se transforma en un menú a pantalla completa en móviles.
* **💬 Contacto Directo:** Formulario con etiquetas flotantes y validación, más accesos a Instagram, WhatsApp y Facebook listos para vincular.
* **🧩 CSS Modular:** Estilos separados por base, componentes y secciones, para hacer cambios de diseño de forma rápida y ordenada.
* **♿ Accesible:** Respeta la preferencia de movimiento reducido (`prefers-reduced-motion`), permite navegar con teclado e incluye enlace para saltar al contenido y textos para lectores de pantalla.
* **⚡ 100% Vanilla Tech:** Sin frameworks ni dependencias; carga ligera y código limpio.

---

## 📂 Arquitectura del Proyecto

El proyecto es una landing de una sola página con estilos organizados por responsabilidad:

```text
proyecto-perfumes/
│
├── index.html                # Página única: Inicio, Sobre nosotros, Catálogo, Sucursales y Contacto
│
├── css/
│   ├── styles.css            # Índice: importa todos los estilos en orden
│   ├── animaciones.css       # Animaciones de entrada y movimiento reducido
│   │
│   ├── base/
│   │   ├── variables.css     # Fuentes, medidas y velocidades
│   │   ├── auras.css         # Paletas de color de cada sección y familia olfativa
│   │   └── reset.css         # Estilos base y accesibilidad
│   │
│   ├── componentes/
│   │   ├── atmosfera.css     # Fondo animado, textura y halo del cursor
│   │   ├── scroll.css        # Barra de scroll, progreso e indicador de secciones
│   │   ├── navbar.css        # Navegación y menú móvil
│   │   ├── botones.css       # Botones
│   │   ├── cinta.css         # Cinta animada de notas olfativas
│   │   └── footer.css        # Pie de página
│   │
│   └── secciones/
│       ├── secciones.css     # Estructura común de las secciones
│       ├── inicio.css        # Hero con la botella dibujada
│       ├── nosotros.css      # Sobre nosotros y pilares de la marca
│       ├── catalogo.css      # Familias olfativas
│       ├── sucursales.css    # Sucursales
│       └── contacto.css      # Formulario, redes sociales y WhatsApp
│
└── js/
    └── main.js               # Auras, scroll propio, animaciones, menú móvil y formulario
```

---

## 💻 Tecnologías y Herramientas

* **HTML5:** Marcado semántico y accesible (atributos `aria-*` y textos para lectores de pantalla).
* **CSS3:** Custom Properties (variables CSS), Grid y Flexbox, `color-mix()`, `backdrop-filter`, `@keyframes` y estilos modulares con `@import`.
* **JavaScript (ES6+):** Intersection Observer para las animaciones y la sección activa, scroll suave con `requestAnimationFrame`, manipulación del DOM y validación del formulario.
* **Iconografía y Tipografía:** Íconos SVG en línea y Google Fonts (Playfair Display y Montserrat).

---

## 🚀 Instalación y Ejecución Local

Si deseas clonar y probar este proyecto en tu entorno local, sigue estos sencillos pasos:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/karmrls/proyecto-perfumes.git
   ```

2. Abre la carpeta del proyecto en tu editor de código favorito (ej. Visual Studio Code).
3. Abre `index.html` directamente en tu navegador, o instala la extensión **Live Server** en VS Code, haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## 🎨 Personalización Rápida

| Quiero cambiar... | Archivo |
| --- | --- |
| Colores de cada sección o familia olfativa | `css/base/auras.css` |
| Fuentes, medidas o velocidades | `css/base/variables.css` |
| Navbar o menú móvil | `css/componentes/navbar.css` |
| El diseño de una sección | `css/secciones/<sección>.css` |
| Textos, sucursales, redes sociales y WhatsApp | `index.html` |

---

## 🚧 Próximos Pasos

* Catálogo completo de perfumes con tarjetas de producto.
* Vincular las cuentas de Instagram, WhatsApp y Facebook.
* Conectar el formulario de contacto a un servicio de envío.
* Agregar los datos reales de cada sucursal.

---

## 💡 Propósito del Proyecto

Este proyecto fue desarrollado como la presencia digital de una perfumería de alta gama: una experiencia inmersiva que transmite la elegancia de la marca, presenta sus sucursales y facilita el contacto directo con los clientes, con una base de código modular lista para crecer junto con su catálogo de fragancias.

---

## 👤 Autor

**Hiram Rosales Segovia** · [GitHub](https://github.com/karmrls)

Estudiante de Ingeniería en Inteligencia Artificial primer grado universitario 2026
