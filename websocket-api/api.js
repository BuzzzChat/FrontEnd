/** Api obsługuje dynamiczne przesyłanie wiadomości, zapraszanie do kontaktów, akceptowanie
 * zaproszeń, odrzucanie zaproszeń, blokowanie kontaktów, usuwanie kontaktów, tworzenie grupy
 * i dodawanie do grupy. Wymaga bibliotek SockJS i Stomp. */

let userId;
let stompClient;

/** wymagana do wywołania po zalogowaniu w celu uruchomienia api */
function init(currentUserId) {
    userId = currentUserId;
    let socket = new SockJS('http://147.135.210.97:81/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, {}, onLogin);
    console.log('log: init')
}

/** Lączy zalogowanego użytkownika w sesji z kontaktami, wywoływana automatycznie */
function initialConnectionLoader() {
    // personal conversation
    let url = 'http://147.135.210.97:81/users/allContacts';
    let data = JSON.stringify({
        "userId": userId,
    });
    fetch(url, {
        headers: new Headers({
            "Content-type": "application/json"
        }),
        body: data,
        method: "POST",
    }).then((response) => response.text())
        .then(data => {
            let contactList = JSON.parse(data);
            for (let i = 0; i < contactList.length; i++) {
                let contact_user_id = contactList[i].contact_user_id;
                let contact_conversationId = contactList[i].conversation_id;
                stompClient.subscribe(`/channel/${contact_conversationId}`, onMessageReceived);
                stompClient.send(`/app/chat/${contact_user_id}/sendMessage`,
                    {}, JSON.stringify({
                        "senderId": userId,
                        "conversationId": contact_conversationId,
                        "messageType": "pending_request",
                        "viewed": false,
                        "content": null,
                        "attachmentType": "none",
                        "attachment": null,
                        "loadingMode": true
                    }));
            }
        })
        .catch((error) => alert("ERROR: " + error.message));

    // group conversation
    url = 'http://147.135.210.97:81/users/groupConversationList';
    data = JSON.stringify({
        "userId": userId,
    });
    fetch(url, {
        headers: new Headers({
            "Content-type": "application/json"
        }),
        body: data,
        method: "POST",
    }).then((response) => response.text())
        .then(data => {
            let groupConversationList = JSON.parse(data);
            for (let i = 0; i < groupConversationList.length; i++) {
                let thisConversationId = groupConversationList[i].conversation.conversationId;
                stompClient.subscribe(`/channel/${thisConversationId}`, onMessageReceived);

                let url = 'http://147.135.210.97:81/management/usersInConversation';
                let data = JSON.stringify({
                    "conversationId": thisConversationId,
                });
                fetch(url, {
                    headers: new Headers({
                        "Content-type": "application/json"
                    }),
                    body: data,
                    method: "POST",
                }).then((response) => response.text())
                    .then(data => {
                        let participantsIdsList = JSON.parse(data);
                        for (let i = 0; i < participantsIdsList.length; i++) {
                            stompClient.send(`/app/chat/${participantsIdsList[i]}/sendMessage`,
                                {}, JSON.stringify({
                                    "senderId": userId,
                                    "conversationId": thisConversationId,
                                    "messageType": "group_add",
                                    "viewed": false,
                                    "content": null,
                                    "attachmentType": "none",
                                    "attachment": null,
                                    "loadingMode": true
                                }));
                        }
                    })
                    .catch((error) => alert("ERROR: " + error.message));
            }
        })
        .catch((error) => alert("ERROR: " + error.message));

    console.log('log: loaded contact list and made connection with them')
}

/** Wywoływana automatycznie */
function onLogin() {
    stompClient.subscribe(`/channel/${userId}`, onContactRequest);
    initialConnectionLoader();
    console.log('log: on login')
}

/** Wywoływana automatycznie */
function onContactRequest(payload) {
    let message = JSON.parse(payload.body);

    stompClient.subscribe(`/channel/${message.conversationId}`, onMessageReceived);
}

/** Wywoływana automatycznie */
function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);

    /** Miejsce na obsługę tych akcji w widoku. Funkcja wywołuje się u obydwu komunikujących
     * się klientów, rozróżnienie u którego na podstawie message.senderId === userId
     * (id obecnego użytkownika zapisywane przy zalogowaniu) */

    if (message.messageType === "chat") {
        console.log(message.content);
    } else if (message.messageType === "pending_request") {
        console.log('pending_request!')
    } else if (message.messageType === "accepting_request") {
        console.log('accepting_request!')
    } else if (message.messageType === "rejecting_request") {
        console.log('rejecting_request!')
    } else if (message.messageType === "contact_removal") {
        console.log('contact_removal!')
    } else if (message.messageType === "contact_block") {
        console.log('contact_block!')
    } else if (message.messageType === "group_add") {
        console.log('group_add!')
    } else if (message.messageType === "existing_group_add") {
        console.log('existing_group_add!')
    }
}

/** Obsługa akcji accepting_request, do wywołania w momencie wciśnięcie przycisku
 * zaproszenia do kontaktów na liście użytkowników */
function sendContactRequest(userId, secondUserId) {
    const url = 'http://147.135.210.97:81/contact/addUser';
    const data = JSON.stringify({
        "invitingUserId": userId,
        "invitedUserId": secondUserId
    });

    fetch(url, {
        headers: new Headers({
            "Content-type": "application/json"
        }),
        body: data,
        method: "POST",
    }).then((response) => response.text())
        .then(data => {
            let conversationId = JSON.parse(data).conversationId;
            console.log('conversation id:' + conversationId);
            stompClient.subscribe(`/channel/${conversationId}`, onMessageReceived);
            stompClient.send(`/app/chat/${secondUserId}/sendMessage`, {}, JSON.stringify({
                "senderId": userId,
                "conversationId": conversationId,
                "messageType": "pending_request",
                "viewed": false,
                "content": null,
                "attachmentType": "none",
                "attachment": null,
                "loadingMode": false
            }));
        })
        .catch((error) => alert("ERROR: " + error.message));
    console.log('log: send contact request')
}

/** do wywołania w momencie wysłania wiadomości */
function sendMessage(conversationId, userId, msg) {
    stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
        "senderId": userId,
        "conversationId": conversationId,
        "messageType": "chat",
        "viewed": false,
        "content": msg,
        "attachmentType": "none",
        "attachment": null,
        "loadingMode": false
    }));
}

/** rodzaje akcji: (parametr type) accepting_request, rejecting_request, contact_removal,
 * contact_block */
function performDynamicAction(conversationId, userId, type) {
    stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
        "senderId": userId,
        "conversationId": conversationId,
        "messageType": type,
        "viewed": false,
        "content": null,
        "attachmentType": "none",
        "attachment": null,
        "loadingMode": false
    }));
}

/** Funkcja przyjmuje listę id (int) dodanych użytkowników oraz id konwersacji
 * grupowej (int), powina być wywołana w momencie utworzenia konwersacji grupowej
 * oraz w momencie dodania nowych członków konwersacji */
function onGroupConversationCreated(participantsIds, groupConversationId) {
    stompClient.subscribe(`/channel/${groupConversationId}`, onMessageReceived);

    for (let i = 0; i < participantsIds.length; i++) {
        stompClient.send(`/app/chat/${participantsIds[i]}/sendMessage`,
            {}, JSON.stringify({
                "senderId": userId,
                "conversationId": groupConversationId,
                "messageType": "group_add",
                "viewed": false,
                "content": null,
                "attachmentType": "none",
                "attachment": null,
                "loadingMode": true
            }));
    }
}