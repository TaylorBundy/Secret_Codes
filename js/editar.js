let data = {};
let data2 = {};
let marcaSeleccionada = "";
let CodigosCargados;
let dataCargadaOriginal;
let dataCargadaEditada;
let numeroDataOriginal;
let numeroDataEditada;
let intervalId = null; // Guardará el ID del setInterval
let intentos = 0;
let intentosMaximos;
let segundos;
let ContadorTabla;
let ordenAscendente = true;
let draggedRow = null;
let codigoBuscado;
let codigoActual;
let codigosEncontrados = [];
let coincidencias = [];
//let indice;

const marcaSelect = document.getElementById("marcaSelect");
const tablaBody = document.querySelector("#tablaCodigos tbody");
const btnAgregarCodigo = document.getElementById("btnAgregarCodigo");
const btnDescargar = document.getElementById("btnDescargar");
const Contador = document.getElementById("contador");

const modal = document.getElementById("modalAgregar");
const inputCodigo = document.getElementById("inputCodigo");
const inputDescripcion = document.getElementById("inputDescripcion");
const selectRiesgo = document.getElementById("selectRiesgo");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnAceptarModal = document.getElementById("btnAceptarModal");
const inputSearch = document.getElementById("searchInput");

const modalEliminar = document.getElementById("modalEliminar");
const textoEliminar = document.getElementById("textoEliminar");
const btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
const btnAceptarEliminar = document.getElementById("btnAceptarEliminar");
const imgAdd = document.querySelector('.imgAdd');
const imgDownload = document.querySelector('.imgDownload');

let indexPendienteEliminar = null; // guardará el índice del item a eliminar

// Configuración inicial de botones
window.onload = function() {
    if (marcaSeleccionada === 'Redmi' || marcaSeleccionada === 'Samsung') {
        btnAgregarCodigo.disabled = btnDescargar.disabled = false;
        btnAgregarCodigo.style.backgroundColor = btnDescargar.style.backgroundColor = "#00C853";
        btnAgregarCodigo.style.cursor = btnDescargar.style.cursor = "pointer";
    } else {
        //btnAgregarCodigo.disabled = btnDescargar.disabled = true;
        btnAgregarCodigo.style.backgroundColor = btnDescargar.style.backgroundColor = "#888";
        btnAgregarCodigo.style.cursor = btnDescargar.style.cursor = "not-allowed";
    }
}
// Cargar JSON automáticamente al abrir
fetch("data/codigos.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    cargarMarcas();
  })
  .catch(err => console.error("Error cargando JSON:", err));
// Cargar marcas en el select
function cargarMarcas() {
    marcaSelect.innerHTML = "<option value=''>-- Elegí una marca --</option>";
    const marcas = [...new Set(data.map(item => item.marca))].sort();
    marcas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    });
}
// Evento de cambio de marca
marcaSelect.addEventListener("change", () => {
    intentos = 0; // Reiniciar intentos al cambiar de marca
    numeroDataOriginal = 0;
    numeroDataEditada = 0;
    marcaSeleccionada = marcaSelect.value;
    dataCargadaOriginal = localStorage.getItem(`codigos${marcaSeleccionada}-Original`);
    dataCargadaEditada = localStorage.getItem(`codigos${marcaSeleccionada}`);
    if (marcaSeleccionada === 'Redmi' || marcaSeleccionada === 'Samsung') {
        btnAgregarCodigo.disabled = false;
        btnAgregarCodigo.style.backgroundColor = "#00C853";
        btnAgregarCodigo.style.cursor = "pointer";
        imgAdd.src = 'images/add_dark.avif';
        // imgDownload.src = 'images/download_dark.avif';
        segundos = 5000;
        intentosMaximos = 5;
        if (dataCargadaOriginal && dataCargadaEditada) {
          numeroDataOriginal = JSON.parse(dataCargadaOriginal).length;
          numeroDataEditada = JSON.parse(dataCargadaEditada).length;
        }
        iniciarTemporizador(segundos, intentosMaximos);
    } else {
        btnAgregarCodigo.disabled = true;
        btnAgregarCodigo.style.backgroundColor = "#888";
        btnAgregarCodigo.style.cursor = "not-allowed";
        imgAdd.src = 'images/add_light.avif';
        // imgDownload.src = 'images/download_light.avif';
        CodigosCargados = 0;
        numeroDataOriginal = 0;
        numeroDataEditada = 0;
        Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
        inputSearch.value = "";
        detenerTemporizador();
    }
    if (!inputSearch.value) {
      mostrarTabla();
      actualizarTabla();
    } else {
      buscarCodigos();
    }
});
// Mostrar tabla de códigos
function mostrarTabla() {
    tablaBody.innerHTML = "";
    if (!marcaSeleccionada) return;
  
    // Filtrar los códigos solo de la marca seleccionada
    const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);

    // Asignar índice si no existe
    codigosFiltrados.forEach((item, index) => {
      if (typeof item.indice === "undefined") {
        //item.indice = 0; // valor por defecto
        item.indice = index + 1; // asignar índice basado en la posición
      }
    });
  
    codigosFiltrados.forEach((item, index) => {
      const fila = document.createElement("tr");
  
      fila.innerHTML = `
        <td data-label="indice" id="indice${index}" class="indice" contenteditable="true" data-field="indice">${item.indice}</td>
        <td id="codigo${index}" class="edit" contenteditable="true" data-field="codigo" onmouseover="Titulos(this.id)">${item.codigo}</td>
        <td id="desc${index}" class="edit" contenteditable="true" data-field="descripcion" onmouseover="Titulos(this.id)">${item.descripcion}</td>
        <td class="edit">
          <select id="riesgoEditar${index}" class="${item.riesgo}" data-field="riesgo" onmouseover="Titulos(this.id)">
            <option style="color: #00E676;" value="Bajo" ${item.riesgo === "Bajo" ? "selected" : ""}>Bajo</option>
            <option style="color: #FFD600;" value="Medio" ${item.riesgo === "Medio" ? "selected" : ""}>Medio</option>
            <option style="color: #FF5252;" value="Alto" ${item.riesgo === "Alto" ? "selected" : ""}>Alto</option>
          </select>
        </td>
        <td class="edit">
          <div class="btnContainer">
            <button id="btnEliminar${index}" class="btnEliminar" data-index="${item.indice - 1}" onmouseover="Titulos(this.id, ${index})"><img id="btnImage2" src="images/delete.avif" alt=""></button>
          </div>
        </td>
      `;
  
      tablaBody.appendChild(fila);
    });
    CodigosCargados = codigosFiltrados.length;
    Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
    ContadorTabla = Contador.textContent.split(':')[1];
    //numeroDataEditada = CodigosCargados;
    // Guardamos en localStorage los códigos filtrados Originales
    if (dataCargadaOriginal || dataCargadaEditada) {
        if (!dataCargadaEditada) {
            localStorage.setItem(`codigos${marcaSeleccionada}`, JSON.stringify(codigosFiltrados));
            dataCargadaEditada = localStorage.getItem(`codigos${marcaSeleccionada}`);
        }
        //console.log(JSON.parse(dataCargadaOriginal));
        numeroDataOriginal = JSON.parse(dataCargadaOriginal).length;
        numeroDataEditada = JSON.parse(dataCargadaEditada).length;
    } else {
        console.log(`No hay datos originales guardados en localStorage para esta marca ${marcaSeleccionada}.\nGuardando datos en: "LocalStorage.codigos${marcaSeleccionada}-Original"`);
        setTimeout(() => {
            localStorage.setItem(`codigos${marcaSeleccionada}-Original`, JSON.stringify(codigosFiltrados));
            localStorage.setItem(`codigos${marcaSeleccionada}`, JSON.stringify(codigosFiltrados));
            console.log("Datos guardados correctamente.");
            dataCargadaOriginal = localStorage.getItem(`codigos${marcaSeleccionada}-Original`);
            dataCargadaEditada = localStorage.getItem(`codigos${marcaSeleccionada}`);
            numeroDataOriginal = JSON.parse(dataCargadaOriginal).length;
            numeroDataEditada = JSON.parse(dataCargadaEditada).length;
            //numeroDataEditada = codigosFiltrados.length;
        }, 1500);
    }
    //localStorage.setItem(`codigos${marcaSeleccionada}-Original`, JSON.stringify(codigosFiltrados));
    // Eliminar fila
    //agregarListenersEliminar();
    // document.querySelectorAll(".btnEliminar").forEach(btn => {
    //     btn.addEventListener("click", e => {
    //       const index = parseInt(e.target.dataset.index); // índice en codigosFiltrados
    //       const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
    //       const itemAEliminar = codigosFiltrados[index];
      
    //       const indexEnData = data.indexOf(itemAEliminar);
    //       if (indexEnData !== -1) {
    //         data.splice(indexEnData, 1);
    //         mostrarTabla();
    //       }
    //     });
    //   });
    // Guardar cambios en edición
    tablaBody.querySelectorAll("td[contenteditable], select").forEach(el => {
      el.addEventListener("input", e => {
        const fila = e.target.closest("tr");
        const index = Array.from(tablaBody.children).indexOf(fila);
        const field = e.target.dataset.field;
        // Encontrar el índice real en data
        const itemReal = data.filter(item => item.marca === marcaSeleccionada)[index];
        if (itemReal) itemReal[field] = e.target.value;
        console.log(itemReal);
        // data.push({
        //   indice: itemReal.indice,
        //   marca: marcaSeleccionada,
        //   codigo: itemReal.codigo,
        //   descripcion: itemReal.descripcion,
        //   riesgo: itemReal.riesgo
        // });
      });
    });
    agregarListenersEliminar();
  }
// Evento de búsqueda
// inputSearch.addEventListener("input", () => {
//   mostrarTabla();
// });

// 🔍 Buscar códigos por texto (código o descripción)
function buscarCodigos() {
  const texto = inputSearch.value.trim();
  if (!marcaSeleccionada) return;

  // Normalizar texto (sin tildes ni mayúsculas)
  const normalizar = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const textoNormalizado = normalizar(texto);

  // Filtrar por marca y coincidencia en código o descripción
  const codigosFiltrados = data.filter(item => 
    item.marca === marcaSeleccionada &&
    (
      normalizar(item.codigo).includes(textoNormalizado) ||
      normalizar(item.descripcion).includes(textoNormalizado)
    )
  );

  // Renderizar tabla filtrada
  tablaBody.innerHTML = "";
  codigosFiltrados.forEach((item, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="indice" id="indice${index}" class="indice" contenteditable="true" data-field="indice${item.indice}">${item.indice}</td>
      <td id="codigo${index}" class="edit" contenteditable="true" data-field="codigo" onmouseover="Titulos(this.id)">${item.codigo}</td>
      <td id="desc${index}" class="edit" contenteditable="true" data-field="descripcion" onmouseover="Titulos(this.id)">${item.descripcion}</td>
      <td class="edit">
        <select id="riesgoEditar${index}" class="${item.riesgo}" data-field="riesgo" onmouseover="Titulos(this.id)">
          <option style="color: #00E676;" value="Bajo" ${item.riesgo === "Bajo" ? "selected" : ""}>Bajo</option>
          <option style="color: #FFD600;" value="Medio" ${item.riesgo === "Medio" ? "selected" : ""}>Medio</option>
          <option style="color: #FF5252;" value="Alto" ${item.riesgo === "Alto" ? "selected" : ""}>Alto</option>
        </select>
      </td>
      <td class="edit">
        <div class="btnContainer">
          <button id="btnEliminar${index}" class="btnEliminar" data-index="${item.indice}" onmouseover="Titulos(this.id, ${index})"><img id="btnImage2" src="images/delete.avif" alt=""></button>
        </div>
      </td>
    `;
    tablaBody.appendChild(fila);
    indice = index;
  });
  //agregarListenersEliminar();
  // Actualizar contador
  CodigosCargados = codigosFiltrados.length;
  Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
  //agregarListenersEliminar();
  // Reasignar listeners para eliminar y editar
  asignarEventosFila(codigosFiltrados, indice);
}

// 🧠 Reasignar eventos de eliminar/editar a las filas renderizadas
// function asignarEventosFila2(codigosFiltrados) {
//   document.querySelectorAll(".btnEliminar").forEach(btn => {
//     btn.addEventListener("click", e => {
//       const index = parseInt(e.target.dataset.index);
//       console.log(index);
//       const itemAEliminar = codigosFiltrados[index];
//       const indexEnData = data.indexOf(itemAEliminar);
//       if (indexEnData !== -1) {
//         data.splice(indexEnData, 1);
//         mostrarTabla();
//       }
//     });
//   });

//   tablaBody.querySelectorAll("td[contenteditable], select").forEach(el => {
//     el.addEventListener("input", e => {
//       const fila = e.target.closest("tr");
//       const index = Array.from(tablaBody.children).indexOf(fila);
//       const field = e.target.dataset.field;
//       const itemReal = codigosFiltrados[index];
//       if (itemReal) itemReal[field] = e.target.value;
//     });
//   });
// }

  // 🧠 Reasignar eventos de eliminar/editar a las filas renderizadas
function asignarEventosFila(codigosFiltrados, idx) {
  document.querySelectorAll(".btnEliminar").forEach((btn, ind) => {
    btn.addEventListener("click", e => {
      const codigosFiltrados2 = codigosFiltrados.filter(item => item.marca === marcaSeleccionada);
      const index = parseInt(e.target.dataset.index);
      const indd = index - 1;
      //indice = btn.dataset.index;
      //const itemAEliminar = codigosFiltrados[index];
      //const itemAEliminar = codigosFiltrados[ind];
      const itemAEliminar = codigosFiltrados2[ind];
      //const indexEnData = data.indexOf(itemAEliminar);
      //const indexEnData = codigosFiltrados2.indexOf(itemAEliminar);
      
      // Mostrar texto del modal
      textoEliminar.innerHTML = `
        ¿Seguro que querés eliminar este código?<br><br>
        <strong>${itemAEliminar.codigo}</strong><br>
        <em>${itemAEliminar.descripcion}</em>
      `;
      // Guardar el índice del ítem para eliminar luego
      //indexPendienteEliminar = indexEnData;
      indexPendienteEliminar = indd;
      // Mostrar modal
      modalEliminar.style.display = "flex";
        
      // if (indexEnData !== -1) {
      //   data.splice(indexEnData, 1);
      //   mostrarTabla();
      // }
    });
  });

  tablaBody.querySelectorAll("td[contenteditable], select").forEach(el => {
    el.addEventListener("input", e => {
      const fila = e.target.closest("tr");
      const index = Array.from(tablaBody.children).indexOf(fila);
      const field = e.target.dataset.field;
      const itemReal = codigosFiltrados[index];
      if (itemReal) itemReal[field] = e.target.value;
      console.log(itemReal);
    });
  });
}

// 🎯 Listener del campo de búsqueda
inputSearch.addEventListener("input", buscarCodigos);


// Abrir modal al presionar "Agregar Código"
btnAgregarCodigo.addEventListener("click", () => {
    if (!marcaSeleccionada) return alert("Seleccioná una marca primero.");
    inputCodigo.value = "";
    inputDescripcion.value = "";
    selectRiesgo.value = "Bajo";
    modal.style.display = "flex";
    inputCodigo.focus();
  });
  
  // Cerrar modal sin agregar
  btnCancelarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  // Confirmar y agregar nuevo código
  btnAceptarModal.addEventListener("click", () => {
    //const nombreMayus = nombre.trim().toUpperCase();
    const nuevoCodigo = inputCodigo.value.trim();
    const nuevaDescripcion = inputDescripcion.value.trim();
    const nuevoRiesgo = selectRiesgo.value;
  
    if (!nuevoCodigo || !nuevaDescripcion) {
      alert("Completa todos los campos antes de agregar.");
      return;
    }
    const existe = data.some(d => d.codigo.trim().toUpperCase() === nuevoCodigo);
    if (existe) {
      alert(`⚠️ El código "${nuevoCodigo}" ya existe en la base de datos.`);
      inputCodigo.value = "";
      inputCodigo.focus();
      return;
    }
  
    // Agregar al array
    data.push({
      marca: marcaSeleccionada,
      codigo: nuevoCodigo,
      descripcion: nuevaDescripcion,
      riesgo: nuevoRiesgo
    });
    const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
    CodigosCargados = codigosFiltrados.length;
    numeroDataEditada = CodigosCargados;
    //console.log(`Número de códigos editados para ${marcaSeleccionada}: ${numeroDataEditada}`);
    //localStorage.setItem(`codigos${marcaSeleccionada}`, JSON.stringify(data));
    localStorage.setItem(`codigos${marcaSeleccionada}`, JSON.stringify(codigosFiltrados));
    localStorage.setItem(`codigos${marcaSeleccionada}-Original`, JSON.stringify(codigosFiltrados));
    segundos = 10000;
    intentosMaximos = 3;
    setTimeout(() => {
      dataCargadaOriginal = localStorage.getItem(`codigos${marcaSeleccionada}-Original`);
      dataCargadaEditada = localStorage.getItem(`codigos${marcaSeleccionada}`);
      iniciarTemporizador(segundos, intentosMaximos);
    }, 1000);
  
    modal.style.display = "none";
    mostrarTabla();
  });
  
  // Cerrar modal si se hace click fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

// Descargar cambios
// btnDescargar.addEventListener("click", () => {
//   const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "codigos.json";
//   a.click();
//   URL.revokeObjectURL(url);
// });

btnDescargar.addEventListener("click", () => {
  const jsonFinal = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonFinal], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "codigos.json";
  a.click();
});


// setTimeout(() => {
//     console.log(`Número de códigos originales para ${marcaSeleccionada}: ${numeroDataOriginal}`);
//     console.log(`Número de códigos editados para ${marcaSeleccionada}: ${numeroDataEditada}`);
// }, 10000);

// 🔁 Comprobar cada X tiempo si los datos visibles cambiaron
function iniciarTemporizador(tiempo, intentosMaximos) {
  //console.log(tiempo);
  //console.log(dataCargadaOriginal);
  if (intervalId) return; // Ya está corriendo, no hacemos nada
  intervalId = setInterval(() => {
    if (intentos < intentosMaximos) {
      //console.log(ContadorTabla);
      //const texto = inputSearch.value.trim();
      // Normalizar texto (sin tildes ni mayúsculas)
      //const normalizar = (str) =>
      //str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      //const textoNormalizado = normalizar(texto2);

      // Filtrar por marca y coincidencia en código o descripción
      //const codigosFiltrados = data.filter(item => 
        //item.marca === marcaSeleccionada &&
        //(
          //normalizar(item.codigo).includes(textoNormalizado) ||
          //normalizar(item.descripcion).includes(textoNormalizado)
        //)
      //);
      //const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
      //const codigos = JSON.stringify(codigosFiltrados);
      //console.log(codigosFiltrados.codigo);
      //console.log(`Contador Tabla: ${ContadorTabla}\nNumero Original: ${numeroDataOriginal}\nNumero Editada: ${numeroDataEditada}`);
      //console.log(codigosFiltrados);
      if (numeroDataOriginal  < ContadorTabla || numeroDataEditada < ContadorTabla) {
          //console.log(`Número de códigos originales: ${numeroDataOriginal} para ${marcaSeleccionada}.\nEs menor a los códigos editados: ${ContadorTabla} para ${marcaSeleccionada}.\nActualizando datos originales en LocalStorage...`);
          btnDescargar.disabled = false;
          btnDescargar.style.backgroundColor = "#00C853";
          btnDescargar.style.cursor = "pointer";
          imgDownload.src = 'images/download_dark.avif';
      } else if (numeroDataOriginal > ContadorTabla || numeroDataEditada > ContadorTabla) {
        //console.log(`Número de códigos originales: ${numeroDataOriginal} para ${marcaSeleccionada}.\nEs mayor a los códigos editados: ${ContadorTabla} para ${marcaSeleccionada}.\nActualizando datos originales en LocalStorage...`);
        btnDescargar.disabled = false;
        btnDescargar.style.backgroundColor = "#00C853";
        btnDescargar.style.cursor = "pointer";
        imgDownload.src = 'images/download_dark.avif';
        //cargarDesdeLocalStorage();
        ActualizaLocalStorage(codigosFiltrados, marcaSeleccionada);
        detenerTemporizador();
      } else {
          //console.log(`Número de códigos originales: ${numeroDataOriginal} para ${marcaSeleccionada}.\nEs igual a los códigos editados: ${numeroDataEditada} para ${marcaSeleccionada}.\nNo se actualizan datos en LocalStorage.`);
          //btnDescargar.disabled = true;
          btnDescargar.style.backgroundColor = "#888";
          btnDescargar.style.cursor = "not-allowed";
          imgDownload.src = 'images/download_light.avif';
      }
      intentos += 1;
    } else {
      console.log(`Se alcanzó el número máximo de intentos: ${intentosMaximos}, deteniendo temporizador`);
      detenerTemporizador();
    }
  }, tiempo); // Cambia 10000 por 5 * 60 * 1000 para 5 minutos
}
// Detener el temporizador completamente
function detenerTemporizador() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      intentos = 0;
      console.log('Temporizador detenido');
    }
  }

  function cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem(`codigos${marcaSeleccionada}-Original`);
    if (datosGuardados) {
      try {
        const lista = JSON.parse(datosGuardados);
        data2 = lista;
        if (Array.isArray(lista) && lista.length > 0) {
          mostrarTabla();
          //cantidadActual = datos.length;
          //console.log(`✅ Datos cargados desde localStorage (${lista.length} artículos)`);
          return data2;
        } else {
          console.warn("⚠️ No se encontraron artículos válidos en localStorage.");
        }
      } catch (e) {
        console.error("❌ Error al leer los datos del localStorage:", e);
      }
    } else {
      console.log("ℹ️ No hay datos guardados en localStorage.");
    }
  }

  function agregarListenersEliminar() {
    const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
    document.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        //console.log(id);
        //indice = `${item.parentElement.parentElement.previousElementSibling.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent}`;
        //const index = parseInt(e.target.dataset.index);
        const index = parseInt(btn.dataset.index);
        console.log(index);
        //const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
        const itemAEliminar = codigosFiltrados[index];
        //console.log(codigosFiltrados[index]);
  
        // Mostrar texto del modal
        textoEliminar.innerHTML = `
          ¿Seguro que querés eliminar este código?<br><br>
          <strong>${itemAEliminar.codigo}</strong><br>
          <em>${itemAEliminar.descripcion}</em>
        `;
  
        // Guardar el índice del ítem para eliminar luego
        indexPendienteEliminar = index;
        //console.log(indexPendienteEliminar);
  
        // Mostrar modal
        modalEliminar.style.display = "flex";
      });
    });
    tablaBody.querySelectorAll("td[contenteditable]").forEach(el => {
      el.addEventListener("input", e => {
        const fila = e.target.closest("tr");
        const index = Array.from(tablaBody.children).indexOf(fila);
        const field = `${e.target.dataset.field}`;
        const itemReal = codigosFiltrados.filter(item => item.marca === marcaSeleccionada)[index];
        codigoActual = itemReal[field];
        indice = index;
        if (itemReal) itemReal[field] = e.target.textContent;
        setTimeout(() => {
          //texto2 = e.target.textContent;
          // console.log(e.target.id);
          // if (e.target.id.includes('riesgoEditar')) {
          //   codigoBuscado = e.target.value;
          // } else {
          //   codigoBuscado = e.target.textContent;
          // }
          codigoBuscado = e.target.textContent;
          //console.log(codigoBuscado);
          buscarEnLocalStorage(marcaSeleccionada, 'codigo', codigoActual, codigoBuscado);
          //iniciarTemporizador(500, 3);
          //ActualizaLocalStorage(codigosFiltrados, marcaSeleccionada);
        }, 500);
      });
    });
    tablaBody.querySelectorAll("select").forEach(el => {
      el.addEventListener("change", e => {
        const fila = e.target.closest("tr");
        const index = Array.from(tablaBody.children).indexOf(fila);
        const field = `${e.target.dataset.field}`;
        const itemReal = codigosFiltrados.filter(item => item.marca === marcaSeleccionada)[index];
        codigoActual = itemReal[field];
        indice = index;
        if (itemReal) itemReal[field] = e.target.value;
        setTimeout(() => {
          if (e.target.id.includes('riesgoEditar')) {
            codigoBuscado = e.target.value;
            e.target.className = codigoBuscado;
            //console.log(fila);
            const select = fila.querySelector("select[data-field='riesgo']");
            select.value = codigoBuscado;
            select.selected = codigoBuscado;
            //console.log(select.selected);
            // const opciones = e.target.options;
            // for (let i = 0; i < opciones.length; i++) {
            //   opciones[i].selected = opciones[i].value === e.target.value; // true para el que querés
            // }
            //console.log(opciones);
          }
          buscarEnLocalStorage(marcaSeleccionada, 'riesgo', codigoActual, codigoBuscado);
        }, 500);
      });
    });
  }
  
  // Cerrar modal sin eliminar
  btnCancelarEliminar.addEventListener("click", () => {
    modalEliminar.style.display = "none";
    indexPendienteEliminar = null;
  });
  
  // Confirmar eliminación
  btnAceptarEliminar.addEventListener("click", () => {
    if (indexPendienteEliminar === null) return;
  
    const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
    const itemAEliminar = codigosFiltrados[indexPendienteEliminar];
    const indexEnData = data.indexOf(itemAEliminar);
  
    if (indexEnData !== -1) {
      data.splice(indexEnData, 1);
      reindexMarca(marcaSeleccionada);
      mostrarTabla();
      //actualizarOrdenDesdeTabla();
      actualizarTabla();
    }
  
    modalEliminar.style.display = "none";
    indexPendienteEliminar = null;
    inputSearch.value = "";
    //actualizarTabla();
  });
  
  // Cerrar si clic fuera del modal
  window.addEventListener("click", e => {
    if (e.target === modalEliminar) {
      modalEliminar.style.display = "none";
      indexPendienteEliminar = null;
    }
  });

  document.getElementById("thIndice").addEventListener("click", (e) => {
    if (ordenAscendente) {
      data.sort((a, b) => a.indice - b.indice);
      e.target.textContent = `# ${Icons.arriba}`;
      e.target.ariaLabel = "menor";
    } else {
      data.sort((a, b) => b.indice - a.indice);
      e.target.textContent = `# ${Icons.abajo}`;
      e.target.ariaLabel = "mayor";
    }
  
    ordenAscendente = !ordenAscendente;
    actualizarTabla();
  });
  // function actualizarTabla2() {
  //   //const tbody = document.getElementById("tablaBody");
  //   tablaBody.innerHTML = ""; // limpiar
  //   const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);

  //   //data.forEach((item, index) => {
  //   codigosFiltrados.forEach((item, index) => {
  //     const fila = document.createElement("tr");
  
  //     fila.innerHTML = `
  //       <!-- <td>${item.indice}</td>
  //       <td>${item.codigo}</td>
  //       <td>${item.descripcion}</td>
  //       <td>${item.riesgo}</td> -->
  //       <td data-label="indice" id="indice${index}" class="indice" contenteditable="true" data-field="indice">${item.indice}</td>
  //       <td id="codigo${index}" class="edit" contenteditable="true" data-field="codigo" onmouseover="Titulos(this.id)">${item.codigo}</td>
  //       <td id="desc${index}" class="edit" contenteditable="true" data-field="descripcion" onmouseover="Titulos(this.id)">${item.descripcion}</td>
  //       <td class="edit">
  //         <select id="riesgoEditar${index}" class="${item.riesgo}" data-field="riesgo" onmouseover="Titulos(this.id)">
  //           <option style="color: #00E676;" value="Bajo" ${item.riesgo === "Bajo" ? "selected" : ""}>Bajo</option>
  //           <option style="color: #FFD600;" value="Medio" ${item.riesgo === "Medio" ? "selected" : ""}>Medio</option>
  //           <option style="color: #FF5252;" value="Alto" ${item.riesgo === "Alto" ? "selected" : ""}>Alto</option>
  //         </select>
  //       </td>
  //       <td class="edit">
  //         <div class="btnContainer">
  //           <button id="btnEliminar${index}" class="btnEliminar" data-index="${item.indice}" onmouseover="Titulos(this.id, ${index})">${Icons.eliminar}</button>
  //         </div>
  //       </td>
  //     `;
  
  //     tablaBody.appendChild(fila);
  //   });
  //   agregarListenersEliminar();
  // }

// 🔄 Renderiza la tabla
function actualizarTabla() {
  //const tbody = document.getElementById("tablaBody");
  tablaBody.innerHTML = "";
  const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);

  codigosFiltrados.forEach((item, index) => {
    //item.indice = index + 1; // actualizamos el índice automáticamente

    const fila = document.createElement("tr");
    fila.draggable = true; // permitir arrastrar
    fila.dataset.index = index;

    fila.innerHTML = `
      <td data-label="indice" id="indice${index}" class="indice" contenteditable="true" data-field="indice">${item.indice}</td>
      <td id="codigo${index}" class="edit" contenteditable="true" data-field="codigo" onmouseover="Titulos(this.id)">${item.codigo}</td>
      <td id="desc${index}" class="edit" contenteditable="true" data-field="descripcion" onmouseover="Titulos(this.id)">${item.descripcion}</td>
      <td class="edit">
        <select id="riesgoEditar${index}" class="${item.riesgo}"  onmouseover="Titulos(this.id, ${index})">
          <option id="riesgoBajo${index}" data-tooltip="${TitulosList.bajo}" style="color: #00E676;" value="Bajo" ${item.riesgo === "Bajo" ? "selected" : ""}>Bajo</option>
          <option id="riesgoMedio${index}" data-tooltip="${TitulosList.medio}" style="color: #FFD600;" value="Medio" ${item.riesgo === "Medio" ? "selected" : ""}>Medio</option>
          <option id="riesgoAlto${index}" data-tooltip="${TitulosList.alto}" style="color: #FF5252;" value="Alto" ${item.riesgo === "Alto" ? "selected" : ""}>Alto</option>
        </select>
        <div id="tooltip" class="tooltip"></div>
      </td>
      <td class="edit">
        <div class="btnContainer">
          <button id="btnEliminar${index}" class="btnEliminar" data-index="${item.indice - 1}" onmouseover="Titulos(this.id, ${index})"><img id="btnImage2" src="images/delete.avif" alt=""></button>
        </div>
      </td>
    `;

    // eventos de arrastre
    fila.addEventListener("dragstart", e => {
      draggedRow = e.currentTarget;
      e.currentTarget.style.opacity = "0.5";
    });

    fila.addEventListener("dragend", e => {
      e.currentTarget.style.opacity = "1";
    });

    fila.addEventListener("dragover", e => {
      e.preventDefault();
      const target = e.currentTarget;
      const tbody = target.parentNode;
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
      tbody.insertBefore(draggedRow, next ? target.nextSibling : target);
    });

    fila.addEventListener("drop", () => {
      actualizarOrdenDesdeTabla();
    });

    tablaBody.appendChild(fila);
  });
  agregarListenersEliminar();
}

// 📊 Actualiza el orden del array `datos` según las filas actuales
// function actualizarOrdenDesdeTabla2() {
//   const filas = [...document.querySelectorAll("#tablaBody tr")];
//   //const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
//   const nuevoOrden = filas.map((f, index) => {
//     console.log(index);
//     const idx = parseInt(f.dataset.index);
//     return data[idx];
//   });
//   console.log(nuevoOrden);
//   data = nuevoOrden;
//   actualizarTabla();
// }

// 📊 Actualiza el orden del array `data` según las filas actuales y la marca seleccionada
function actualizarOrdenDesdeTabla() {
  const filas = [...document.querySelectorAll("#tablaBody tr")];
  
  // Filtrar los elementos de la marca seleccionada
  const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);

  // Crear nuevo orden solo para la marca activa
  const nuevoOrdenFiltrado = filas.map((f, index) => {
    const idx = parseInt(f.dataset.index);
    const item = codigosFiltrados[idx];
    // Actualizamos su índice visible
    item.indice = index + 1;
    return item;
  });
  //console.log(nuevoOrdenFiltrado);

  // 🔄 Reemplazar los elementos de esa marca dentro del array global `data`
  data = data.filter(item => item.marca !== marcaSeleccionada).concat(nuevoOrdenFiltrado);

  // Reordenar globalmente manteniendo la consistencia del orden
  data.sort((a, b) => {
    if (a.marca < b.marca) return -1;
    if (a.marca > b.marca) return 1;
    return a.indice - b.indice;
  });

  // 🔁 Actualizar la tabla visible
  actualizarTabla();
}
// --- Reindexa los items de una marca (1..N) y actualiza localStorage si corresponde
function reindexMarca(marca) {
  // obtener los elementos de esa marca en el orden actual dentro de data
  const elementos = data.filter(item => item.marca === marca);

  // reasignar índices consecutivos empezando en 1
  elementos.forEach((el, idx) => {
    el.indice = idx + 1;
  });

  // ahora reconstruir data: eliminar los antiguos de esa marca y concatenar los reindexados
  const otros = data.filter(item => item.marca !== marca);
  data = otros.concat(elementos);

  // si guardás una copia en localStorage, actualizarla también
  try {
    if (localStorage.getItem(`codigos${marca}`)) {
      localStorage.setItem(`codigos${marca}`, JSON.stringify(elementos));
    }
    if (localStorage.getItem(`codigos${marca}-Original`)) {
      // si querés mantener el Original no lo sobrescribas; aquí solo actualizo la edición
      localStorage.setItem(`codigos${marca}-Original`, JSON.stringify(elementos));
    }
  } catch (e) {
    console.warn("No se pudo actualizar localStorage:", e);
  }
}
// --- Actualiza localStorage con los elementos dados para la marca dada
function ActualizaLocalStorage (elementos, marca) {
  try {
    if (localStorage.getItem(`codigos${marca}`)) {
      localStorage.setItem(`codigos${marca}-2`, JSON.stringify(elementos));
    } else {
      localStorage.setItem(`codigos${marca}-2`, JSON.stringify(elementos));
    }
    if (localStorage.getItem(`codigos${marca}-Original`)) {
      // si querés mantener el Original no lo sobrescribas; aquí solo actualizo la edición
      localStorage.setItem(`codigos${marca}-Original-2`, JSON.stringify(elementos));
    } else {
      localStorage.setItem(`codigos${marca}-Original-2`, JSON.stringify(elementos));
    }
  } catch (e) {
    console.warn("No se pudo actualizar localStorage:", e);
  }
}

// 🧩 Función auxiliar para normalizar texto (ignora mayúsculas y tildes)
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
}

// 🔍 Buscar en LocalStorage dentro de una marca específica
function buscarEnLocalStorage(marca, campo, valorActual, valorBuscado) {
  //console.log(valorActual);
  //console.log(valorBuscado);
  //console.log(indice);
  if (!marca || !campo || !valorActual || !valorBuscado) {
    console.warn("⚠️ Parámetros incompletos en buscarEnLocalStorage()");
    return [];
  }

  // Intentar obtener los datos del LocalStorage
  const clave = `codigos${marca}`;
  //const clave = `${marca}`;
  const data2 = JSON.parse(localStorage.getItem(clave)) || [];

  coincidencias = data2.filter(obj =>
    obj.codigo?.toString().includes(valorActual) ||
    obj.descripcion?.includes(valorActual) ||
    obj.riesgo?.includes(valorActual)
  );
  console.log(coincidencias);

  // for (let i = 0; i < data2.length; i++) {
  //   //console.log(i);
  //   const campoCodigo = data2[indice];
  //   codigosEncontrados.push(campoCodigo.codigo);
    
  //   // const existe = data.some(d => d[i]?.codigo.trim() === valor);
  //   // console.log(existe);
  //   // if (existe) {
  //   //   console.log(`✅ El valor "${valor}" fue encontrado en ${clave}.`);
  //   // }
  // }
  //console.log(codigosEncontrados);
  //const listo = codigosEncontrados.find(item => item === valor);
  //console.log(listo);
  const existe = data2.some(d => d.codigo.trim() === valorActual) || data2.some(d => d.descripcion.trim() === valorActual) || data2.some(d => d.riesgo.trim() === valorBuscado);
  if (existe) {
    //console.log(`✅ 843 El valor "${valorActual}" fue encontrado en ${clave}.`);
    if (valorActual !== valorBuscado) {
      const codigosFiltrados = data.filter(item => item.marca === marcaSeleccionada);
      console.log(codigosFiltrados);
      console.log(`✏️ El valor "${valorActual}" fue modificado a "${valorBuscado}" en ${clave}.`);
      ActualizaLocalStorage(codigosFiltrados, marcaSeleccionada);
    }
  }
  //const data = localStorage.getItem(clave);
  //console.log(data);

  // Normalizamos el valor buscado
  //const valorBuscado2 = normalizar(valorBuscado);
  //const resultado = data.find(item => item.codigo === valor);
  //console.log(resultado);

  // Filtramos los resultados que coincidan parcialmente en el campo indicado
  // const resultados = data2.filter((item, index) => {
  //   //console.log(index);
  //   const campoTexto = normalizar(String(item[campo] || ""));
  //   console.log(campoTexto);
  //   return campoTexto.includes(valorActual);
  // });
  // if (resultados.includes(valorActual)) {
  //   console.log(`✅ 861 El valor "${valorBuscado}" fue encontrado en ${clave}.`);
  // }

  //console.log(`🔎 Resultados encontrados en ${clave}:`, resultados);
  //return resultados;
}
