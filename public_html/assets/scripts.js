/**
 * Variables globales
 */

let data;
let dataFiltered = {};
let orderFlag = false;

/**
 * Función que se ejecuta una vez que se haya cargado la página
 */

window.onload = async () => {
    const filter = document.getElementById('filter');
    const btnReOrder = document.getElementById('reorder');

    filter.addEventListener('keyup', event => filterData(event.target.value));

    btnReOrder.addEventListener('click', event => {
        event.preventDefault();

        reOrder(Object.keys(dataFiltered).length === 0 ? data : dataFiltered);

        event.target.innerHTML = orderFlag ? 'Z - A' : 'A - Z';

        orderFlag = !orderFlag;
    });

    try {
        data = await obtenerRazas();

        reOrder(data);
        render(data);
        renderImgPreview();
    } catch (error) {
        console.error(error);
    }
}

// Función para mostrar la imagen ampliada que se selecciono

const renderImgPreview = (img = '') => {
    const column = document.getElementsByClassName('segunda-columna')[0];

    column.innerHTML = "";

    if(img === '') {
        column.insertAdjacentHTML('afterbegin', `
            <h4>Haz click sobre una imagen para ampliarla.</h4>
        `);
    } else {
        column.insertAdjacentHTML('afterbegin', `
            <img src="${img}" width="100" height="100" class="img-selected">
        `);
    }
}

// Función para reordenar alfabeticamente las razas

const reOrder = (obj) => {
    const dataOrdered = Object.keys(obj).sort((a,b) => {
            return orderFlag ? a.localeCompare(b) : b.localeCompare(a);
        }).reduce((newObject, objectKey) => {
            newObject[objectKey] = data[objectKey];
            return newObject;
        }, {});

    render(dataOrdered);
}

// Función para filtrar las razas

const filterData = (value) => {
    dataFiltered = Object.keys(data).filter((raza) => {
        return raza.includes(value);
    }).reduce((newObject, objectKey) => {
        newObject[objectKey] = data[objectKey];
        return newObject;
    },{});
    render(dataFiltered);
}

// Funcion para crear los elementos en el DOM para mostrar las razas con las imagenes

const render = (data) => {
    const root = document.getElementsByClassName('general')[0];
    
    root.innerHTML = "";
    
    if (Object.keys(data).length === 0) {
        root.insertAdjacentHTML('afterbegin', `
            <h3>No se han encontrado resultados...</h3>
        `);
    } else {
        Object.keys(data).forEach(async (raza, i, arr) => {
            const fotos = await obtenerFotos(raza);            
            root.insertAdjacentHTML('afterbegin', `
                <div class="${raza} images-container">
                    <h3>${raza}</h3>
                    <div>
                        <img src="${fotos[0] ? fotos[0] : 'assets/no-image.jpg'}" width="100" height="100" class="img-click">
                        <img src="${fotos[1] ? fotos[1] : 'assets/no-image.jpg'}" width="100" height="100" class="img-click">
                        <img src="${fotos[2] ? fotos[2] : 'assets/no-image.jpg'}" width="100" height="100" class="img-click">
                    </div>
                </div>
            `);
            if(arr.length -1 === i) {
                document.querySelectorAll('.img-click').forEach(e => e.addEventListener('click', event => {
                    renderImgPreview(event.target.src);
                }));
            }
        });
    }
}

// Función para realizar la llamada al API que obtiene las razas

const obtenerRazas = () => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await fetch('https://dog.ceo/api/breeds/list/all');
            const data = await res.json();
            
            resolve(data.message);
        } catch (error) {
            reject(error);
        }
    })
}

// Función para realizar la llamada al API que obtiene las fotos de una raza en especifico

const obtenerFotos = (raza) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await fetch(`https://dog.ceo/api/breed/${raza}/images`);
            const data = await res.json();
            
            resolve(data.message);
        } catch (error) {
            reject(error);
        }
    })
}