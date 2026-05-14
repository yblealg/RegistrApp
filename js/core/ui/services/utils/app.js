import { DICCIONARIO_SIR } from "./diccionario.js";

/* ================= VARIABLES ================= */

let listaActos = [];

/* ================= ELEMENTOS ================= */

const txtCodigoActo = document.getElementById("txtCodigoActo");
const txtNombreActo = document.getElementById("txtNombreActo");
const txtCuantia = document.getElementById("txtCuantia");
const txtFolios = document.getElementById("txtFolios");

const tablaActos = document.getElementById("tablaActos");

const lblTotalGeneral = document.getElementById("lblTotalGeneral");

const btnAgregarActo = document.getElementById("btnAgregarActo");

/* ================= EVENTOS ================= */

txtCodigoActo.addEventListener("input", buscarActo);

btnAgregarActo.addEventListener("click", agregarActo);

/* ================= FUNCIONES ================= */

function buscarActo(){

    const codigo = txtCodigoActo.value.trim();

    const info = DICCIONARIO_SIR[codigo];

    if(info){

        txtNombreActo.value = info.acto;

    }else{

        txtNombreActo.value = "";
    }
}

function agregarActo(){

    const codigo = txtCodigoActo.value.trim();

    const info = DICCIONARIO_SIR[codigo];

    if(!info){

        alert("Código SIR inválido");
        return;
    }

    const cuantia = parseFloat(txtCuantia.value) || 0;

    const folios = parseInt(txtFolios.value) || 1;

    let total = calcularDerechos(
        info,
        cuantia,
        folios
    );

    listaActos.push({

        codigo,
        acto:info.acto,
        cuantia,
        folios,
        total
    });

    renderTabla();

    limpiarCampos();
}

function calcularDerechos(
    info,
    cuantia,
    folios
){

    let derechos = 0;

    /* ===== CON CUANTIA ===== */

    if(info.tarifa === "CON CUANTIA"){

        if(cuantia <= 12852101){

            derechos = 53100;
        }

        else if(cuantia <= 192778606){

            derechos = cuantia * 0.00911;
        }

        else if(cuantia <= 334149656){

            derechos = cuantia * 0.01131;
        }

        else if(cuantia <= 494798857){

            derechos = cuantia * 0.01260;
        }

        else{

            derechos = cuantia * 0.01333;
        }
    }

    /* ===== SIN CUANTIA ===== */

    else if(info.tarifa === "SIN CUANTIA"){

        derechos = 29500;

        if(folios > 1){

            derechos +=
            (folios - 1) * 15300;
        }
    }

    /* ===== FIJA ===== */

    else if(info.tarifa === "FIJA"){

        derechos = info.valor;
    }

    /* ===== ESPECIAL ===== */

    else if(info.tarifa === "ESPECIAL"){

        derechos =
        (cuantia * 0.00911) * 0.5;

        if(derechos < 26550){

            derechos = 26550;
        }
    }

    /* ===== MANUAL ===== */

    else if(info.tarifa === "MANUAL"){

        derechos = cuantia;
    }

    /* ===== CONSERVACIÓN ===== */

    if(info.tarifa !== "MANUAL"){

        derechos =
        Math.ceil((derechos * 1.02) / 100) * 100;
    }

    return Math.round(derechos);
}

function renderTabla(){

    tablaActos.innerHTML = "";

    let granTotal = 0;

    listaActos.forEach((item,index)=>{

        granTotal += item.total;

        tablaActos.innerHTML += `

            <tr>

                <td>
                    ${item.codigo}
                </td>

                <td>
                    ${item.acto}
                </td>

                <td>
                    ${
                        item.cuantia > 0
                        ?
                        "$" + item.cuantia.toLocaleString("es-CO")
                        :
                        item.folios
                    }
                </td>

                <td>
                    $
                    ${item.total.toLocaleString("es-CO")}
                </td>

                <td>

                    <button
                    onclick="eliminarActo(${index})"
                    >
                        ❌
                    </button>

                </td>

            </tr>
        `;
    });

    lblTotalGeneral.innerText =
    "$ " +
    granTotal.toLocaleString("es-CO");
}

function limpiarCampos(){

    txtCodigoActo.value = "";

    txtNombreActo.value = "";

    txtCuantia.value = "0";

    txtFolios.value = "1";

    txtCodigoActo.focus();
}

/* ================= ELIMINAR ================= */

window.eliminarActo = function(index){

    listaActos.splice(index,1);

    renderTabla();
};