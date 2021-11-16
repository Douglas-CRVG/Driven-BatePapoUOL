const URL_API = "https://mock-api.driven.com.br/api/v4/uol";
//participants
//status
//messages

let user = {};


let lastMessage;
let penultimateMessage;

enterRoom();

function enterRoom() {
    user = { name: prompt("Digite o nome de usuário:") };
    if (user.name === "") {
        alert("Insira um nome válido!");
        enterRoom();
    }
    const promise = axios.post(URL_API + "/participants", user);
    promise.then(fetchMessages);
    promise.catch((props) => {
        alert("Nome de usuário já está sendo utilizado. Por favor, insira outro nome");
        enterRoom();
    });
}

function fetchMessages() {
    axios.get(URL_API + "/messages").then(renderMessages);
}

function renderMessages(response) {
    const props = response.data;
    penultimateMessage = lastMessage;
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
    lastMessage = document.querySelector("main div:last-child");
    if (lastMessage !== penultimateMessage){
        lastMessage.scrollIntoView();
    }
}

setInterval(fetchMessages, 3000);

setInterval(() => {
    axios.post(URL_API + "/status", user);
}, 5000);

let message ={
    from: user.name,
    to: "Todos",
    type: "message"
};

function sendMessage(){
    const text = document.querySelector("input");
    message.text = text.value;
    text.value = "";
    const promise = axios.post(URL_API + "/messages", message);
    promise.then(fetchMessages);
    promise.catch(() => window.location.reload());
}