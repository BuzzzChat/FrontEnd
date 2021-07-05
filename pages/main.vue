<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
    <div class="split">
        <!-- Lewa podstrona-znajomi, wyszukiwarka, ustawienia profilu i wylogowanie -->
        <div class="lewy">
            <div class="naglowek">
                <div class="ikony_uzytkownika">
                    <button title="Wyloguj" id="btn_wyloguj" class="btn_lewy" @click="logout">
                        <i class="material-icons">&#xe879;</i>
                    </button>
                </div>
                <div class="user">
                    <div class="avatar">
                        <span>{{ initial }}</span>
                    </div>
                </div>
                <div class="ikony_uzytkownika">
                    <!-- Edycja profilu -->
                    <modal title="Edycja profilu" btn_class="btn_lewy" btn_id="btn_edycja">
                        <template v-slot:button>
                            <i class="material-icons">&#xe8b8;</i>
                        </template>

                        <!-- TODO: component -->
                        <div class="gornyPasek">
                            <p> Edycja profilu </p>
                        </div>
                        <div class="pole">
                            <changenick class="pole-lewe"></changenick>
                            <changepass class="pole-prawe"></changepass>
                        </div>
                    </modal>
                </div>
            </div>
            <!-- Wyszukiwarka -->
            <form v-on:submit.prevent="search" class="wyszukiwarka">
                <div class="wpisywanie">
                    <input type="text" placeholder="Szukaj..." v-model="search_text" v-on:keyup="search">
                </div>
                <div class="przycisk">
                    <button class="btn_lewy" v-on:click.prevent="clear_search"
                            v-if="search_results.length > 0 || search_text"><i class="material-icons">close</i></button>
                    <button class="btn_lewy"><i class="material-icons">search</i></button>
                </div>
            </form>
            <div class="" v-if="search_results.length > 0 || search_text">
                <ul>
                    <searchresult v-for="result in search_results" :username="result.user.username"
                                  :userid="result.user.id" :is_contact="!! result.contact"></searchresult>
                </ul>
            </div>
            <div class="listy" v-if="search_results.length < 1 && !search_text">
                <!-- Znajomi -->
                <div class="znajomi">
                    <a> Znajomi</a>
                    <ul>
                        <contact v-for="friend in friends" :friend="friend" :message_callback="chat"></contact>
                    </ul>
                </div>
                <!-- Czat grupowy -->
                <div class="czat_grupowy">
                    <div class="Grupowy_czat">
                        <a>Czat grupowy </a>
                        <a><i class="material-icons icon-text button">add</i></a>
                    </div>
                </div>
                <!-- Zaproszenia -->
                <div class="zaproszenia">
                    <a>Zaproszenia do znajomych</a>
                    <ul>
                        <waiting v-for="friend in waiting" :friend="friend" :callback="refresh"></waiting>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Ekran rozmowy -->
        <discussion :chatid="chatid" :name="name" :usr="this.$root.authenticated.username" >
        </discussion>
    </div>
</template>

<script>
    module.exports = {
        components: {
            'modal': httpVueLoader('../components/modal.vue'),
            'question': httpVueLoader('../components/question.vue'),
            'changenick': httpVueLoader('../components/change_nick.vue'),
            'changepass': httpVueLoader('../components/change_pass.vue'),
            'discussion': httpVueLoader('../components/discussion.vue'),
            'contact': httpVueLoader('../components/contact.vue'),
            'searchresult': httpVueLoader('../components/search_result.vue'),
            'waiting': httpVueLoader('../components/waiting.vue')
        },
        data: function () {
            return {
                username: '',
                chatid: 0,
                name: '',
                friends: [],
                waiting: [],
                search_results: [],
                search_text: '',
                messages: [],
                contactName: '',
                contacting_user_id: '',
                api: null,
            }
        },
        computed: {
            initial: function () {

                return this.$root.initial.toUpperCase();
            }
        },
        methods: {
            mounted: function () {
                this.$root.logout()
            },
            logout: function () {
                this.$root.logout()
            },
            clear_search: function () {
                this.search_text = '';
                this.search_results = []
            },
            chat: function (chatid, name, contacting_user_id) {
                this.chatid = chatid;
                this.name = name;
                this.contactName = name;
                this.contacting_user_id = contacting_user_id;
            },
            search: function () {
                let data = {
                    userId: this.$root.authenticated.id,
                    searchValue: this.search_text
                };
                axios.post(
                    this.$root.endpoint + '/management/searchUser',
                    data,
                    this.$root.axiosConfig
                ).then(response => {
                    console.log(response.data);
                    this.search_results = response.data
                }, error => {
                    console.log('Problem z połączeniem')
                });
            },
            get_contacts: function () {
                let data = {
                    userId: this.$root.authenticated.id
                };
                axios.post(
                    this.$root.endpoint + '/users/contactList',
                    data,
                    this.$root.axiosConfig
                ).then(response => {
                    this.friends = response.data;
                }, error => {
                    console.log('Problem z połączeniem')
                });
            },
            get_waiting: function () {
                let data = {
                    userId: this.$root.authenticated.id
                };
                axios.post(
                    this.$root.endpoint + '/users/expectantContactList',
                    data,
                    this.$root.axiosConfig
                ).then(response => {
                    this.waiting = response.data;
                }, error => {
                    console.log('Problem z połączeniem')
                });
            },
            get_messages: function () {
                let data = {
                    conversationId: this.chatid,
                    userId: this.$root.authenticated.id
                };
                axios.post(
                    this.$root.endpoint + '/conversation/listMessages',
                    data,
                    this.$root.axiosConfig
                ).then(response => {
                    this.messages = response.data;
                    console.log(response.data)
                }, error => {
                    console.log('Problem z połączeniem')
                });
            },
            refresh: function () {
                console.log('Refreshing list...');
                this.get_contacts();
                this.get_waiting();
                this.get_messages();
                let chatEl = document.getElementById("scroll");
                if (chatEl !== null) {
                    chatEl.scrollTop = chatEl.scrollHeight;
                }

                let data = {
                    conversationId: this.chatid,
                    contactOwnerId: this.$root.authenticated.id,
                };
                axios.post(
                    this.$root.endpoint + '/contact/relation',
                    data,
                    this.$root.axiosConfig
                ).then(response => {
                    console.log(response.data.relation);
                    let input = document.getElementById("message_input");
                    if (input != null) {
                        input.disabled = response.data.relation !== 'friends';
                    }
                }, error => {
                    this.errors.push('Problem z połączeniem. Spróbuj ponownie później')
                });
            },
            update: function () {
                this.refresh();
            },
        },
        mounted: function () {
            if (!this.$root.authenticated) {
                this.$router.replace({name: "start"});
                return
            }
            this.username = this.$root.username;

            let ref = this.refresh;
            let self = this;

            function init(currentUserId) {
                userId = currentUserId;
                let socket = new SockJS(self.$root.endpoint +'/ws');
                stompClient = Stomp.over(socket);
                stompClient.connect({}, {}, onLogin);
                console.log('log: init')
            }

            function initialConnectionLoader() {
                let url = self.$root.endpoint +'/users/allContacts';
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
                            let privateChannel = 'user' + contact_user_id;
                            let contact_conversationId = contactList[i].conversation_id;
                            stompClient.subscribe(`/channel/${contact_conversationId}`, self.receiver);
                            stompClient.send(`/app/chat/${privateChannel}/sendMessage`,
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

                url = self.$root.endpoint +'/users/groupConversationList';
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
                            stompClient.subscribe(`/channel/${thisConversationId}`, self.receiver);

                            let url = self.$root.endpoint +'/management/usersInConversation';
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
                                        let privateChannel = 'user' + participantsIdsList[i];
                                        stompClient.send(`/app/chat/${privateChannel}/sendMessage`,
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

            function onLogin() {
                let privateChannel = 'user' + userId;
                stompClient.subscribe(`/channel/${privateChannel}`, self.contactSender);
                initialConnectionLoader();
                console.log('log: on login')
            }

            this.contactSender = function onContactRequest(payload) {
                let message = JSON.parse(payload.body);
                stompClient.subscribe(`/channel/${message.conversationId}`, self.receiver);
                ref();
            };

            this.receiver = function onMessageReceived(payload) {
                let message = JSON.parse(payload.body);

                ref();

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
            };
            init(this.$root.authenticated.id, this.refresh);
            this.refresh();
        }
    }
</script>
