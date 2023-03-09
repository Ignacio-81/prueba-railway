const socket = io();

const logStatus = () => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {

            fetch('/loginstatus')
                .then((response) => response.json())
                .then(function (response) {
                    console.log('fetch')
                    resolve(response)
                })
                .catch(function (error) {
                    reject('WE have a problem with "Fetch" command:' + error.message);
                });


        }, 1000)

    })
    /*     var parameters = location.search.substring(1)
        var temp = parameters.split("=");
        document.getElementById("usertext").innerHTML = temp[1]; */

}
const getLog = async () => {
    await logStatus().then((response) => {
        console.log(response)
        if (response.login == "true") {
            document.getElementById("usertext").innerHTML = response.user.username
        } else {
            Swal.fire({
                title: 'See you ' + document.getElementById("usertext").textContent,
                text: 'Logout Success',
                icon: 'success',
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false
            }).then(() => {
                console.log("Swal")
                window.location.href = '/logout';
            })
        }

    })
}
getLog()
const logoutEvent = (event) => {
    event.preventDefault();
    Swal.fire({
        title: 'See you ' + document.getElementById("usertext").textContent,
        text: 'Logout Success',
        icon: 'success',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
    }).then(() => {
        console.log("Swal")
        window.location.href = '/logout';
    })
}

const userform = document.getElementById("headerform");

userform.addEventListener('submit', logoutEvent);

//New Product constants
const productsPool = document.getElementById("tableBody");
const productForm = document.getElementById("addProductForm");
const productName = document.getElementById("name");
const productPrice = document.getElementById("price");
const produdctthumbnail = document.getElementById("thumbnail");

//send client data through socket
const sendData = (type, data) => {
    socket.emit(type, data);
};

const renderProducts = (productData) => {
    console.log("Data de producto : ", productData)
    productsPool.innerHTML = ""
    productData.forEach((product) => {
        const { title, price, thumbnail } = product
        productsPool.innerHTML += `
            <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img
                      src="${thumbnail}"
                      alt=""
                      style="width: 100px; height: 100px"
                    />
                  </div>
                </td>
                <td>
                  <p class="fw-normal mb-1">${title}</p>
                </td>
                <td>
                  <p class="rounded-pill d-inline">
                    ${price}
                  </p>
                </td>
            </tr>`
    })

};

// Definimos la funcion submit handler, se ejecuta cuando se dispara el evento submit del form
const submitProductHandler = async (event) => {
    //Ejecutamos la funcion preventDefault() para evitar que se recargue la pagina
    event.preventDefault();
    await getLog()
    // Definimos la informacion del mensaje, es un obejto con una propiedad "username" y "message"
    const productInfo = {
        title: productName.value,
        price: productPrice.value,
        thumbnail: produdctthumbnail.value,
    };


    sendData("client:productData", productInfo);
    productName.value = "";
    productPrice.value = "";
    produdctthumbnail.value = "";

};

productForm.addEventListener("submit", submitProductHandler);

const chatForm = document.getElementById("chatForm");
const userName = document.getElementById("userName");
const message = document.getElementById("message");
const messagesPool = document.getElementById("messagesPool");

const renderMessage = (messagesData) => {
    ;
    const html = messagesData.map((messageInfo) => {
        return `<div > <strong style="color:blue;">${messageInfo.username}</strong><em style="color:brown;"> [${messageInfo.hourDate}] </em><em style="color:green; font-style: italic;" >${messageInfo.message}</em> </div>`;
    });

    messagesPool.innerHTML = html.join(" ");
};

// Definimos la funcion submit handler, se ejecuta cuando se dispara el evento submit del form

const submitMessageHandler = async (event) => {
    //Ejecutamos la funcion preventDefault() para evitar que se recargue la pagina
    event.preventDefault();
    await getLog()
    let today = new Date();
    let date = today.toLocaleString()
    // Definimos la informacion del mensaje, es un obejto con una propiedad "username" y "message"
    const messageInfo = {
        username: userName.value,
        hourDate: date,
        message: message.value,
    };
    // Ejecutamos la funcion sendMessage() que la encargada de enviar el mensaje al back pasandole como parametro la informacion del mensaje
    sendData("client:message", messageInfo);

    // Vaciamos el message input asi queda libre para escribir un nuevo mensaje
    message.value = "";
    userName.readOnly = true;
};

chatForm.addEventListener("submit", submitMessageHandler);



socket.on("server:message", renderMessage);
socket.on("server:products", renderProducts);