let titulo;
let indice;
// Iconos Unicode para botones y títulos
const Icons = {
    csv: "📦",
    csv2: "📝",
    carpeta: "📂",
    advertencia: "⚠️",
    informacion: "ℹ️",
    limpiar: "♻️",
    guardar: "💾",
    anterior: "⏮️",
    anterior2: "◀",
    siguiente: "⏭️",
    siguiente2: "▶",
    arriba: "\u2B06\uFE0F",
    abajo: "\u2B07\uFE0F",
    seleccionar: "\u{1F446}",
    buscar: "🔎",
    cancelar: "⛔",
    eliminar: "✖️",
    ok: "✔️",
    salir: "🚫",
    agregar: "➕",
    retry: "🔁",
    editar: "✏️",
    foco: "💡",
    question: "❓",
    money: "💰",
    money2: "💲",
    cargando: "⌛",
    reloj: "🕙"
  };
//  🧠 Títulos para tooltips
const TitulosList = {
    searchInput: `${Icons.buscar} Buscar artículos por Código o Descripción.\nBúsqueda parcial y sin acentos.`,
    btnAgregar: `${Icons.agregar} Agregar el nuevo Código a la base de datos.`,
    btnEditar: `💡 Abrir página para ${Icons.editar}"editar" JSON.!`,
    btnGuardar: `${Icons.guardar} Guardar los cambios realizados en la base de datos.`,
    contador: `${Icons.informacion} Cantidad de códigos en la base de datos.`,
    seleccionar: `${Icons.seleccionar} Seleccionar una marca de la lista.!`,
    seleccionarEditar: `${Icons.seleccionar} Seleccionar una marca de la lista para editar o eliminar un código.!`,
    btnEliminar: `${Icons.eliminar} Eliminar el código seleccionado de la lista.`,
    btnCancelarEliminar: `${Icons.cancelar} Cancelar y cerrar este cuadro.`,
    btnAceptarEliminar: `${Icons.ok} Eliminar código seleccionado.!\n${Icons.advertencia} Al eliminar un código, el mismo no puede ser recuperado.!`,
    ordenar: `${Icons.retry} Ordenar la lista de códigos de forma ascendente o descendente por indice.`,
    ordenarMenor: `${Icons.abajo} Ordenar la lista de códigos de ${Icons.abajo}(menor) a ${Icons.arriba}(mayor) por indice.`,
    ordenarMayor: `${Icons.arriba} Ordenar la lista de códigos de ${Icons.arriba}(mayor) a ${Icons.abajo}(menor) por indice.`,
    bajo: "Riesgo minimo o controlado.",
    medio: "Riesgo moderado o potencial.",
    alto: "Riesgo elevado o crítico.",

    porcentajeInput: "➗ Aplicar un porcentaje a todos los precios deudores.\nEjemplo: 10 para aumentar 10%, -5 para reducir 5%.\nValor por defecto: 20%",
    chkPorcentaje: "Activar o ➗desactivar el uso del porcentaje.",
    btnFormularioAgregar: `💡 Abrir formulario para ${Icons.agregar}"agregar" artículo nuevo.!`,
    btnGuardarEditar: `${Icons.guardar} Guardar los cambios realizados en el artículo.`,
    btnCargar: `${Icons.csv}📝📂 Cargar archivo CSV con la base de datos de productos.`,
    btnCancelar: `${Icons.cancelar} Cancelar y cerrar este cuadro.`,
    btnFormularioEliminar: `💡 Abrir formulario para ${Icons.eliminar}"eliminar" artículo.!`,
    btnEliminar: `${Icons.eliminar} Eliminar el artículo seleccionado de la base de datos.`,
    btnLimpiar: `${Icons.limpiar} Limpiar datos de todos los campos.`,
    btnAnterior: `${Icons.anterior} Mostrar artículo anterior.!`,
    btnSiguiente: `${Icons.siguiente} Mostrar artículo siguiente.!`,
    resultadoEliminar: "Artículo encontrado para eliminar.\nVerifique que sea el correcto.",
    modalEliminarSinData: `${Icons.advertencia} Acá se van a mostrar el artículo que busca para eliminar.!\nVerifique el artículo antes de confirmar la eliminación.!`,
    modales: `${Icons.salir} Precione "ESC" para cerrar este cuadro.`
  };
  //const tooltip = document.getElementById('tooltip');
//Definimos la funcion que agrega los titulos a los componentes
function Titulos(id, indirec = null) {
    //const optionsSelect = document.querySelector(`#riesgoEditar${indirec} option[value="Bajo"]`);
    const optionsSelect = document.querySelector(`#riesgoEditar${indirec}`);
    //console.log(optionsSelect.value);
    //console.log(optionsSelect.querySelector(`option[value="${optionsSelect.value}"]`));
    //segundosTooltip = 1500;
    const item = document.getElementById(`${id}`);
    //console.log(item);
    //console.log(item.parentElement.previousSibling.previousElementSibling.previousElementSibling);
    if (item.id.includes('searchInput')) {
        //item.title = TitulosList.searchInput;
        titulo = TitulosList.searchInput;
    } else if (item.id.includes('btnAgregar')) {
        //item.title = TitulosList.btnAgregar;
        titulo = TitulosList.btnAgregar;
    } else if (item.id.includes('btnEditar')) {
        //item.title = TitulosList.btnEditar;
        titulo = TitulosList.btnEditar;
    } else if (item.id.includes('btnDescargar')) {
        //item.title = TitulosList.btnGuardar;
        titulo = TitulosList.btnGuardar;
    } else if (item.id.includes('contador')) {
        const contador = item.textContent.split(':')[1];
        //item.title = `${TitulosList.contador}\nTotal de códigos: ${contador}`;
        titulo = `${TitulosList.contador}\nTotal de códigos: ${contador}`;
        item.style.cursor = 'help';
    } else if (item.className.includes('marcaSelectEditar')) {
        if (item.value !== "") {
            //titulo = item.value;
            titulo = `${TitulosList.seleccionar}\nMarca seleccionada:\n•${item.value}`;
        } else {
            // Obtener el texto de todas las opciones del select
            const opciones = Array.from(item.options).map(opt => opt.textContent.trim()).filter(txt => txt && txt !== "-- Elegí una marca --");
            //titulo = opciones.join('\n•');
            titulo = `${TitulosList.seleccionarEditar}\nMarcas disponibles:\n•${opciones.join('\n•')}`;
        }
        // Mostrar en el tooltip
        //item.title = `${TitulosList.seleccionarEditar}\nMarcas disponibles:\n•${titulo}`;
        //item.title = titulo;
        item.style.cursor = 'help';
    } else if (item.id.includes('marcaSelect')) {
        if (item.value !== "") {
            //titulo = item.value;
            titulo = `${TitulosList.seleccionar}\nMarca seleccionada:\n•${item.value}`;
        } else {
            // Obtener el texto de todas las opciones del select
            const opciones = Array.from(item.options).map(opt => opt.textContent.trim()).filter(txt => txt && txt !== "-- Elegí una marca --");
            //titulo = opciones.join('\n•');
            titulo = `${TitulosList.seleccionar}\nMarcas disponibles:\n•${opciones.join('\n•')}`;
        }
        //item.title = titulo;
        item.style.cursor = 'help';
    }
    if (item.id.includes('codigo')) {
        //item.title = `Código: ${item.textContent}`;
        titulo = `Código: ${item.textContent}`;
    } else if (item.id.includes('desc')) {
        //item.title = `Descripción: ${item.textContent}`;
        titulo = `Descripción: ${item.textContent}`;
    } else if (item.id.includes('riesgoIndex')) {
        //item.title = `Riesgo: ${item.textContent}`;
        titulo = `Riesgo: ${item.textContent}`;
    } else if (item.id.includes('riesgoEditar')) {
        //item.title = `Riesgo: ${item.value}`;
        titulo = `Riesgo: ${item.value}`;
    //} else if (optionsSelect.value.includes('Alto')) {
        //item.title = `Riesgo: ${item.value}`;
        // titulo = `Riesgo 134: ${optionsSelect.value}`;
        // optionsSelect.querySelector(`option[value="${optionsSelect.value}"]`).title = titulo;
    } else if (item.className.includes('btnEliminar')) {
        //item.title = `Precio Venta: ${item.textContent}`;
        indice = `${item.parentElement.parentElement.previousElementSibling.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent}`;
        //console.log(`Indice: ${indice -1}`);
        //console.log(`Indice: ${item.parentElement.parentElement.previousElementSibling.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent}`);
        //console.log(item.parentElement.parentElement);
        titulo = `Eliminar elemento\nCódigo: ${item.parentElement.parentElement.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent}\nDescripción: ${item.parentElement.parentElement.previousSibling.previousElementSibling.previousElementSibling.textContent}\nRiesgo: ${item.parentElement.parentElement.previousElementSibling.firstElementChild.value}\nIndice Real: ${indice -1}`;
    } else if (item.id.includes('btnCancelarEliminar')) {
        titulo = `${TitulosList.btnCancelarEliminar}`;
    } else if (item.id.includes('btnAceptarEliminar')) {
        titulo = `${TitulosList.btnAceptarEliminar}`;
    } else if (item.id.includes('thIndice')) {
        if (item.ariaLabel.includes('menor')) {
            titulo = `${TitulosList.ordenarMayor}`;
        } else if (item.ariaLabel.includes('mayor')){
            titulo = `${TitulosList.ordenarMenor}`;
        } else {
            titulo = `${TitulosList.ordenar}`;
        }
    }
    if (optionsSelect) {
        //let bajo = "Riesgo minimo o controlado.";
        //let medio = "Riesgo moderado o potencial.";
        //let alto = "Riesgo elevado o crítico.";
        if (optionsSelect.value.includes('Bajo')) {
            optionsSelect.querySelector(`option[value="${optionsSelect.value}"]`).title = `${TitulosList.bajo}`;//'Riesgo minimo o controlado.';
            optionsSelect.querySelector(`option[value="Medio"]`).title = `${TitulosList.medio}`;
            optionsSelect.querySelector(`option[value="Alto"]`).title = `${TitulosList.alto}`;
        } else if (optionsSelect.value.includes('Medio')) {
            optionsSelect.querySelector(`option[value="${optionsSelect.value}"]`).title = `${TitulosList.medio}`;//'Riesgo moderado o potencial.';
            optionsSelect.querySelector(`option[value="Bajo"]`).title = `${TitulosList.bajo}`;
            optionsSelect.querySelector(`option[value="Alto"]`).title = `${TitulosList.alto}`;
        } else if (optionsSelect.value.includes('Alto')) {
            optionsSelect.querySelector(`option[value="${optionsSelect.value}"]`).title = `${TitulosList.alto}`;//'Riesgo elevado o crítico.';
            optionsSelect.querySelector(`option[value="Bajo"]`).title = `${TitulosList.bajo}`;
            optionsSelect.querySelector(`option[value="Medio"]`).title = `${TitulosList.medio}`;
        }
    }
    item.title = titulo;
    // const select = document.getElementById(`riesgoEditar${indirec}`);
    // console.log(select);

    // select.addEventListener('mousemove', e => {
    //     console.log(e.target.value);
    //     const option = e.target;
    //     console.log(option.id);
    //     const text = option.dataset;
    //     console.log(text);
    //     if (option.tagName === 'OPTION') {
    //       //const text = option.dataset.tooltip;
    //       console.log(text);
    //       if (text) {
    //         tooltip.textContent = text;
    //         tooltip.style.left = e.pageX + 10 + 'px';
    //         tooltip.style.top = e.pageY + 10 + 'px';
    //         tooltip.style.opacity = 1;
    //       }
    //     }
    //   });
      
    //   select.addEventListener('mouseleave', () => {
    //     tooltip.style.opacity = 0;
    //   });

    // if (item.className.includes('precio1')) {
    //   titulo = `Producto: ${item.previousElementSibling.textContent}\nPrecio Venta: ${item.textContent}\nIndice: ${indirec + 1}`;//${item.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent};
    // } else if (item.className.includes('precio2')) {
    //   titulo = `Producto: ${item.previousElementSibling.previousElementSibling.textContent}\nPrecio Deudores: ${item.textContent}`;
    // } else if (item.className.includes('producto')) {
    //   titulo = `Producto: ${item.textContent}\nId: ${item.previousElementSibling.textContent}\nPrecio Venta: ${item.nextElementSibling.textContent}\nPrecio Deudores: ${item.nextElementSibling.nextElementSibling.textContent}`;
    // } else if (item.className.includes('codigo')) {
    //   titulo = `Código de barras: ${item.textContent}`;
    // }
    //  item.addEventListener('mouseover', (e) => {
    //   item.title = titulo;
    //   item.style.cursor = 'help';
    //  });
    // item.addEventListener('mouseout', () => {
    //   setTimeout(() => {
    //     indiceOriginal = null;
    //   }, 500);
    // });
}