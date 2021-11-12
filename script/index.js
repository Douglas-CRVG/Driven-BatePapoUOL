const URL_API = "https://mock-api.driven.com.br/api/v4/uol";
//participants
//status
//messages
setInterval(fetchMessages, 3000)
function fetchMessages(){
    axios.get(URL_API + "/messages").then(renderMessages)
}

function renderMessages(response){
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

        if(type === "status"){
            containerMessages.innerHTML +=`
            <div class="status" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from} </strong>${text}
                </p>
            </div>
            `;
        } else if(type === "private_message"){
            containerMessages.innerHTML +=`
            <div class="private" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from}</strong> reservadamente para <strong>${to}: </strong>${text}
                </p>
            </div>
            `;
        } else {
            containerMessages.innerHTML +=`
            <div class="message" data-identifier="message">
                <p>
                    <span>(${time})  </span><strong>${from}</strong> para <strong>${to}:  </strong>${text}
                </p>
            </div>
            `;
        } 
    });
}

fetchMessages()