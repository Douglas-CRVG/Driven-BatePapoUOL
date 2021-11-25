const URL_API = "https://mock-api.driven.com.br/api/v4/uol";
//participants

const inputScreenEnter = document.querySelector("section input");
inputScreenEnter.addEventListener('keyup', (e)=>{
    const key = (e.which || e.keyCode);
    if (key == 13) {
        enterRoom();
    }
});

const inputSendMessageEnter = document.querySelector("footer input");
inputSendMessageEnter.addEventListener('keyup', (e)=>{
    const key = (e.which || e.keyCode);
    if (key == 13) {
        sendMessage();
    }
});

let user = {};
let lastMessage;
let penultimateMessage;

function enterRoom() {
    const section = document.querySelector("section");
    const gif = document.querySelector("section div");
    user = { name: document.querySelector("section input").value };
    gif.innerHTML = `
    <img src="assets/loading.gif" alt="Loading...">
    <p>Entrando...</p>
    `;

    setTimeout(() => {
        if (user.name === "") {
            alert("Insira um nome válido!");
            window.location.reload();
        }
        const promise = axios.post(URL_API + "/participants", user);
        promise.then(()=> {
            fetchMessages();
            section.classList.add("hidden");
        });
        promise.catch(error);
    }, 1000);
}

function error(props){
    if (props.response.status === 400) {
        alert("Nome de usuário já está sendo utilizado. Por favor, insira outro nome");
        window.location.reload();
    } else {
        alert("Erro no sistema!");
    }
}

function fetchMessages() {
    axios.get(URL_API + "/messages").then(renderMessages);
}

function renderMessages(response) {
    const props = response.data;
    const containerMessages = document.querySelector("main");
    containerMessages.innerHTML = "";
    props.map(prop => {
        const {
            from,
            to,
            text,
            type,
            time
        } = prop;

        if (type === "status") {
            containerMessages.innerHTML += `
            <div class="status" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from} </strong>${text}
                </p>
            </div>
            `;
        } else if (type === "private_message" && (from === user.name || to === user.name)) {
            containerMessages.innerHTML += `
            <div class="private" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from}</strong> reservadamente para <strong>${to}: </strong>${text}
                </p>
            </div>
            `;
        } else {
            containerMessages.innerHTML += `
            <div class="message" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from}</strong> para <strong>${to}:  </strong>${text}
                </p>
            </div>
            `;
        }
    });
    penultimateMessage = lastMessage;
    lastMessage = document.querySelector("main div:last-child");
    if (lastMessage.innerHTML !== penultimateMessage.innerHTML) {
        lastMessage.scrollIntoView();
    }
}

setInterval(fetchMessages, 3000);

setInterval(() => {
    if (user.name !== undefined) {
        axios.post(URL_API + "/status", user);
    }
}, 5000);

function sendMessage() {
    const message = {
        from: user.name,
        to: "Todos",
        type: "message"
    };
    const text = document.querySelector("footer input");
    message.text = text.value;
    text.value = "";
    if (message.text !== "") {
        const promise = axios.post(URL_API + "/messages", message);
        promise.then(fetchMessages);
        promise.catch(() => {
            window.location.reload();
        });
    }
}