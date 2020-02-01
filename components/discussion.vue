<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
    <div class="prawy" id="parent">
        <div class="split2" id="pane" v-if="chatid">
            <!-- Naglowek znajomego -->
            <div class="naglowek_rozmowy">
                <div class="nazwa_znajomego">
                    <a>{{ name }}</a>
                </div>
                <div class=ikony_znajomego">
                    <div class="Zmiana">
                        <modal title="Zmiana nicku" id="btn_zmiana" btn_class="btn_prawy">
                            <template v-slot:button>
                                <i class="material-icons">edit</i>
                            </template>
                        </modal>
                    </div>
                    <!-- Blokowanie -->
                    <div class="blokowanie">
                        <question title="Blokowanie użytkownika" id="btn_blok" btn_class="btn_prawy"
                                  @yes="contactBlock">
                            <template v-slot:button>
                                <i class="material-icons">block</i>
                            </template>

                            <div>
                                <p>Czy na pewno chcesz zablokować tego użytkownika?</p>
                            </div>
                        </question>
                    </div>
                    <!-- Usuwanie -->
                    <div class="Usuwanie">
                        <question title="Usuwanie kontaktu:" id="btn_usuw" btn_class="btn_prawy"
                                  @yes="contactRemove">
                            <template v-slot:button>
                                <i class="material-icons">delete</i>
                            </template>

                            <div>
                                <p>Czy na pewno chcesz usunąć tego użytkownika?</p>
                            </div>
                        </question>
                    </div>
                </div>
            </div>
            <!-- Rozmowa -->
            <div class="czat">
                <div id="scroll" class="scrollbox">
                    <template v-for="message in this.$parent.messages">
                        <div v-if="message.message.messageType === 'chat'" v-bind:class="message.sender === 'User' ? 'wiadomosc_moja' : 'wiadomosc_znajomego'">
                            <div class="avatar">
                                <span>{{ message.sender === 'User' ? usr.charAt(0) : name.charAt(0) }}</span>
                            </div>
                            <div class="dymek">
                                <p>{{ message.message.content }}</p>
                            </div>
                        </div>
                    </template>
                    <div class="anchor"></div>
                </div>
            </div>
            <!-- Pisanie wiadomosci, wysylanie plikow, zdjec itp -->
            <form id="sendForm" v-on:submit.prevent="sendMessage" class="wiadomosc">
                <div class = "ikony_wiadomosci">
                    <div class = "plik">
                        <button type="button" class = "btn_lewy"><i class="material-icons">insert_drive_file</i></button>
                    </div>
                    <div class = "zdjecie">
                        <button type="button" class = "btn_lewy"><i class="material-icons">add_photo_alternate</i></button>
                    </div>
                    <div class = "emoji">
                        <button type="button" class = "btn_lewy"><i class="material-icons">insert_emoticon</i></button>
                    </div>
                </div>
                <div class="wpisywanie_wiadomosci">
                    <input id="message_input" type="text" placeholder="Napisz wiadomosc..." v-model="message_text">
                </div>
                <div class="ikony_wiadomosci">
                    <div class="wyslij">
                        <button class="btn_lewy"><i class="material-icons">send</i></button>
                    </div>
                </div>
            </form>
        </div>
        <div class="nochat" id="nochat" v-else>
            <h1>Witaj!</h1>
            <div class="nochat-content">
                <p> Korzystaj ze wszystkich funkcjonalności komunikatora Buzzz! </p>
                <p> Wysyłaj pliki, zdjęcia i emotki! </p>
                <p> Rozmawiaj ze znajomymi prywatnie, swobodnie, bez limitów! </p>
                <!-- <p> Zaproś znajomych do prywatnego czatu grupowego! </p> -->

            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        components: {
            'modal': httpVueLoader('../components/modal.vue'),
            'question': httpVueLoader('../components/question.vue'),
        },
        props: ['usr', 'chatid', 'name', 'message_callback'],
        data: function () {
            return {
                messages: [],
                message_text: ''
            }
        },
        methods: {
            contactRemove: function () {
                let message = JSON.stringify({
                    "senderId": this.$root.authenticated.id,
                    "conversationId": this.chatid,
                    "messageType": "contact_removal",
                    "viewed": false,
                    "content": null,
                    "attachmentType": "none",
                    "attachment": null,
                    "loadingMode": false
                });
                //this.$parent.api.sendMessage(this.chatid, this.$root.authenticated.id, message);
                stompClient.send(`/app/chat/${this.chatid}/sendMessage`, {}, message);
                this.messages = this.$parent.messages;
                this.message_text = '';
                document.getElementById("message_input").value = '';
                this.$parent.refresh();
            },
            sendMessage: function () {
                if (this.message_text.trim() !== '') {
                    let message = JSON.stringify({
                        "senderId": this.$root.authenticated.id,
                        "conversationId": this.chatid,
                        "messageType": "chat",
                        "viewed": false,
                        "content": this.message_text,
                        "attachmentType": "none",
                        "attachment": null,
                        "loadingMode": false
                    });
                    stompClient.send(`/app/chat/${this.chatid}/sendMessage`, {}, message);
                    this.messages = this.$parent.messages;
                    this.message_text = '';
                    document.getElementById("message_input").value = '';
                    this.$parent.refresh();
                }
            },
            contactBlock: function () {
                let message = JSON.stringify({
                    "senderId": this.$root.authenticated.id,
                    "conversationId": this.chatid,
                    "messageType": "contact_block",
                    "viewed": false,
                    "content": null,
                    "attachmentType": "none",
                    "attachment": null,
                    "loadingMode": false
                });
                stompClient.send(`/app/chat/${this.chatid}/sendMessage`, {}, message);
                this.messages = this.$parent.messages;
                this.message_text = '';
                document.getElementById("message_input").value = '';
                this.$parent.refresh();
            },
        },

    };
</script>
