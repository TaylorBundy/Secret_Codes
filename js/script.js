const selectMarca = document.getElementById("marcaSelect");
const tablaBody = document.querySelector("#tablaCodigos tbody");
const Contador = document.getElementById("contador");
const btnEditar = document.getElementById("btnEditar");
const inputSearch = document.getElementById("searchInput");
let marcaSeleccionada = "";
let CodigosCargados;
let datos = [];

window.onload = function() {
  if (marcaSeleccionada === 'Redmi' || marcaSeleccionada === 'Samsung') {
      btnEditar.disabled = false;
      btnEditar.style.backgroundColor = "#00C853";
      btnEditar.style.cursor = "pointer";
  } else {
      btnEditar.disabled = true;
      btnEditar.style.backgroundColor = "#888";
      btnEditar.style.cursor = "not-allowed";
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//     // Cargar el archivo JSON
//     fetch("data/codigos.json")
//       .then(res => res.json())
//       .then(data => {
//         datos = data;
//         // Obtener las marcas dinámicamente
//         //const marcas = Object.keys(data);
//         const marcas = [...new Set(data.map(item => item.marca))].sort();
//         marcas.forEach(marca => {
//           const option = document.createElement("option");
//           option.value = marca;
//           option.textContent = marca;
//           selectMarca.appendChild(option);
//         });
  
//         // Evento de cambio de marca
//         selectMarca.addEventListener("change", () => {
//           //const marcaSeleccionada = selectMarca.value;
//           marcaSeleccionada = selectMarca.value;
//           tablaBody.innerHTML = "";
      
//           if (!marcaSeleccionada) return;
      
//           const filtrados = data.filter(i => i.marca === marcaSeleccionada);
      
//           filtrados.forEach(c => {
//             const tr = document.createElement("tr");
//             tr.innerHTML = `
//               <td>${c.codigo}</td>
//               <td>${c.descripcion}</td>
//               <td class="${c.riesgo}">${c.riesgo}</td>
//             `;
//             tablaBody.appendChild(tr);
//           });
//           if (marcaSeleccionada === 'Redmi' || marcaSeleccionada === 'Samsung') {
//             btnEditar.disabled = false;
//             CodigosCargados = filtrados.length;
//             Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
//           } else {
//             btnEditar.disabled = true;
//             CodigosCargados = 0;
//             Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
//           }
//         });
//       })
//       .catch(err => {
//         console.error("Error cargando codigos.json:", err);
//         tablaBody.innerHTML = "<tr><td colspan='3'>No se pudo cargar el archivo</td></tr>";
//       });
//   });

// 🔎 Búsqueda con restauración si está vacío
document.addEventListener("DOMContentLoaded", () => {
  //let marcaSeleccionada = null;

  // Cargar el archivo JSON
  fetch("data/codigos.json")
    .then(res => res.json())
    .then(data => {
      datos = data;
      const marcas = [...new Set(data.map(item => item.marca))].sort();

      marcas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        selectMarca.appendChild(option);
      });

      // Evento de cambio de marca
      selectMarca.addEventListener("change", () => {
        marcaSeleccionada = selectMarca.value;
        mostrarTabla();
      });

      // Evento de búsqueda
      inputSearch.addEventListener("input", () => {
        mostrarTabla();
      });

      // function mostrarTabla2() {
      //   tablaBody.innerHTML = "";

      //   if (!marcaSeleccionada) return;

      //   const texto = inputSearch.value.toLowerCase().trim();
      //   const filtrados = datos.filter(i => 
      //     i.marca === marcaSeleccionada &&
      //     (i.codigo.toLowerCase().includes(texto) ||
      //       i.descripcion.toLowerCase().includes(texto))
      //   );

      //   filtrados.forEach(c => {
      //     const tr = document.createElement("tr");
      //     tr.innerHTML = `
      //       <td>${c.codigo}</td>
      //       <td>${c.descripcion}</td>
      //       <td class="${c.riesgo}">${c.riesgo}</td>
      //     `;
      //     tablaBody.appendChild(tr);
      //   });

      //   if (marcaSeleccionada === "Redmi" || marcaSeleccionada === "Samsung") {
      //     btnEditar.disabled = false;
      //     CodigosCargados = filtrados.length;
      //     Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
      //   } else {
      //     btnEditar.disabled = true;
      //     CodigosCargados = 0;
      //     Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
      //   }
      // }
    })
    .catch(err => {
      console.error("Error cargando codigos.json:", err);
      tablaBody.innerHTML = "<tr><td colspan='3'>No se pudo cargar el archivo</td></tr>";
    });
});

function mostrarTabla() {
  tablaBody.innerHTML = "";
  if (!marcaSeleccionada) return;

  const texto = normalizar(inputSearch.value.trim());
  const filtrados = datos.filter(i =>
    i.marca === marcaSeleccionada &&
    (
      normalizar(i.codigo).includes(texto) ||
      normalizar(i.descripcion).includes(texto)
    )
  );

  filtrados.forEach((c, idx) => {
    const tr = document.createElement("tr");
    tr.className = 'infoIndex';
    tr.innerHTML = `
      <td id="codigo${idx}" class="codigo${idx}" onmouseover="Titulos(this.id)">${c.codigo}</td>
      <td id="desc${idx}" class="desc${idx}" onmouseover="Titulos(this.id)">${c.descripcion}</td>
      <td id="riesgoIndex${idx}" class="${c.riesgo}" onmouseover="Titulos(this.id)">${c.riesgo}</td>
    `;
    tablaBody.appendChild(tr);
  });

  if (marcaSeleccionada === "Redmi" || marcaSeleccionada === "Samsung") {
    btnEditar.disabled = false;
    CodigosCargados = filtrados.length;
    Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
  } else {
    btnEditar.disabled = true;
    CodigosCargados = 0;
    Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
  }
}

// 🔤 Función para normalizar texto (sin mayúsculas ni tildes)
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD") // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, ""); // elimina los acentos
}

selectMarca.addEventListener("change", () => {
  marcaSeleccionada = selectMarca.value;
  if (marcaSeleccionada === 'Redmi' || marcaSeleccionada === 'Samsung') {
    btnEditar.disabled = false;
    btnEditar.style.backgroundColor = "#00C853";
    btnEditar.style.cursor = "pointer";
  } else {
    btnEditar.disabled = true;
    btnEditar.style.backgroundColor = "#888";
    btnEditar.style.cursor = "not-allowed";
    CodigosCargados = 0;
    Contador.innerHTML = `Códigos cargados: ${CodigosCargados}`;
    inputSearch.value = "";
  }
});
  
// Botón para abrir el editor
document.getElementById("btnEditar").addEventListener("click", () => {
  window.open("editar.html", "_blank");
});