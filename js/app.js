import { DICCIONARIO_SIR }
from "./data/diccionario.js";

/* ================= ESTADO ================= */

let liquidacion = [];

/* ================= ELEMENTOS ================= */

const txtCodigoActo =
document.getElementById("txtCodigoActo");

const txtNombreActo =
document.getElementById("txtNombreActo");

const txtCuantia =
document.getElementById("txtCuantia");

const txtFolios =
document.getElementById("txtFolios");

const tablaActos =
document.getElementById("tablaActos");

const lblTotalGeneral =
document.getElementById("lblTotalGeneral");

const btnAgregarActo =
document.getElementById("btnAgregarActo");

const btnNuevo =
document.getElementById("btnNuevo");

/* ================= CONSTANTES ================= */

const VALOR_SIN_CUANTIA = 29500;
const VALOR_FOLIO_ADIC = 15300;
const TARIFA_MINIMA = 53100;

/* ================= EVENTOS ================= */

txtCodigoActo.addEventListener(
    "input",
    buscarActo
);

btnAgregarActo.addEventListener(
    "click",
    agregarActo
);

btnNuevo.addEventListener(
    "click",
    nuevaLiquidacion
);

/* ================= FUNCIONES ================= */

function buscarActo() {

    const codigo =
    txtCodigoActo.value.trim();

    const info =
    DICCIONARIO_SIR[codigo];

    if(info){

        txtNombreActo.value =
        info.acto;

    } else {

        txtNombreActo.value =
        "";

    }

}

function agregarActo(){

    const codigo =
    txtCodigoActo.value.trim();

    const info =
    DICCIONARIO_SIR[codigo];

    if(!info){

        alert(
        "Código SIR inválido"
        );

        return;

    }

    let cuantia =
    parseFloat(
    txtCuantia.value
    ) || 0;

    let folios =
    parseInt(
    txtFolios.value
    ) || 1;

    let subtotal = 0;

    /* ================= CON CUANTIA ================= */

    if(info.tarifa === "CON CUANTIA"){

        if(cuantia <= 0){

            alert(
            "Debe ingresar cuantía"
            );

            return;

        }

        if(cuantia <= 12852101){

            subtotal = TARIFA_MINIMA;

        }

        else if(cuantia <= 192778606){

            subtotal =
            cuantia * 0.00911;

        }

        else if(cuantia <= 334149656){

            subtotal =
            cuantia * 0.01131;

        }

        else if(cuantia <= 494798857){

            subtotal =
            cuantia * 0.01260;

        }

        else {

            subtotal =
            cuantia * 0.01333;

        }

    }

    /* ================= SIN CUANTIA ================= */

    else if(info.tarifa === "SIN CUANTIA"){

        subtotal =
        VALOR_SIN_CUANTIA;

        if(folios > 1){

            subtotal +=
            (folios - 1)
            *
            VALOR_FOLIO_ADIC;

        }

    }

    /* ================= FIJA ================= */

    else if(info.tarifa === "FIJA"){

        subtotal =
        info.valor || 0;

    }

    /* ================= ESPECIAL ================= */

    else if(info.tarifa === "ESPECIAL"){

        subtotal =
        (cuantia * 0.00911)
        *
        0.5;

        if(subtotal < 26550){

            subtotal = 26550;

        }

    }

    /* ================= EXENTO ================= */

    else if(info.tarifa === "EXENTO"){

        subtotal = 0;

    }

    /* ================= CONSERVACION ================= */

    let total =
    Math.ceil(
    (subtotal * 1.02)
    / 100
    ) * 100;

    liquidacion.push({

        codigo,
        acto: info.acto,
        cuantia,
        folios,
        total

    });

    renderTabla();

    limpiarFormulario();

}

function renderTabla(){

    tablaActos.innerHTML = "";

    let granTotal = 0;

    liquidacion.forEach(

        (item,index)=>{

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
                "$ " +
                item.cuantia.toLocaleString("es-CO")
                :
                item.folios
                }
            </td>

            <td>
                $ ${item.total.toLocaleString("es-CO")}
            </td>

            <td>

                <button
                onclick="eliminarActo(${index})">

                    ✕

                </button>

            </td>

        </tr>

        `;

    });

    lblTotalGeneral.innerHTML =

    "$ " +

    granTotal.toLocaleString(
    "es-CO"
    );

}

window.eliminarActo = function(index){

    liquidacion.splice(index,1);

    renderTabla();

}

function limpiarFormulario(){

    txtCodigoActo.value = "";
    txtNombreActo.value = "";
    txtCuantia.value = "";
    txtFolios.value = 1;

    txtCodigoActo.focus();

}

function nuevaLiquidacion(){

    const confirmar =
    confirm(
    "¿Nueva liquidación?"
    );

    if(!confirmar) return;

    liquidacion = [];

    renderTabla();

    limpiarFormulario();

}

/* ================= FECHA ================= */

document.getElementById(
"txtFecha"
).value =

new Date()
.toISOString()
.split("T")[0];