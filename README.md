# 🔐 Códigos Secretos Samsung y Redmi

Aplicación web desarrollada en **HTML, CSS y JavaScript** que permite visualizar, buscar y editar los **códigos secretos** utilizados en dispositivos **Samsung Galaxy** y **Xiaomi / Redmi**.  
Estos códigos brindan acceso a menús ocultos, herramientas de diagnóstico y funciones avanzadas del sistema.

---

## 🚀 Características principales

- 📱 Listado completo de códigos secretos para **Samsung** y **Redmi**
- 🔍 Buscador rápido e interactivo con filtrado en tiempo real
- ✏️ Edición, eliminación y agregado de códigos desde la interfaz
- 💾 Guardado automático en **LocalStorage**
- 📂 Carga inicial desde archivo `codigos.json`
- 🔧 Código modular, fácil de mantener y extender

---

## 🧱 Estructura del proyecto

```
📁 CodigosSecretosSamsungRedmi/
 ├── css/
 │   └── estilos.css                # Estilos de la interfaz
 │
 ├── data/
 │   └── codigos.json               # Base de datos con los códigos
 │
 ├── images/
 │   ├── edit_light.avif                  # Imagenes
 │   ├── edit_dark.avif                  # Imagenes
 │   ├── add_light.avif                  # Imagenes
 │   ├── add_dark.avif                  # Imagenes
 │   ├── download_light.avif                  # Imagenes
 │   ├── download_dark.avif                  # Imagenes
 │   ├── delete.avif                  # Imagenes
 │   ├── search.avif                  # Imagenes
 │   └── favicon.ico                  # Favicon
 │
 ├── js/
 │   ├── assets.js                  # Funciones comunes y reutilizables
 │   ├── editar.js                  # Lógica de la página de edición
 │   └── script.js                  # Funciones principales (página inicial)
 │
 ├── index.html                     # Página principal (búsqueda y listado)
 ├── editar.html                    # Página de edición de códigos
 └── README.md
```

---

## ⚙️ Funcionamiento

1. Al abrir `index.html`, la aplicación carga los códigos desde `data/codigos.json` o desde **LocalStorage** si ya existen datos guardados localmente.  
2. Permite **buscar** por código, descripción o categoría.  
3. Desde `editar.html` se pueden **agregar, modificar o eliminar** códigos fácilmente.  
4. Los cambios se guardan automáticamente en **LocalStorage**, sin necesidad de servidor o base de datos externa.

---

## 🧩 Tecnologías utilizadas

- **HTML5**  
- **CSS3 (Flexbox + Grid)**  
- **JavaScript (Vanilla)**  
- **LocalStorage API**

---

## 📦 Instalación y uso

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/TaylorBundy/Secret_Codes.git
   ```
2. Abrí `index.html` directamente en tu navegador (no requiere servidor).
3. Si querés editar los códigos, accedé a `editar.html`.

---

## 🧑‍💻 Autor

**Taylor Bundy**  
Programador Junior  
📧 Contacto: [martonbarbosa@gmail.com](mailto:martonbarbosa@gmail.com)

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.  
Podés usarlo, modificarlo y distribuirlo libremente, siempre dando crédito al autor original.

---

### ⭐ Contribuciones

Si querés colaborar agregando nuevos códigos o mejorando la interfaz:
1. Hacé un **fork** del repositorio.  
2. Creá una nueva rama (`feature/nueva-funcion`).  
3. Enviá un **pull request**.  

Toda contribución es bienvenida 🙌
