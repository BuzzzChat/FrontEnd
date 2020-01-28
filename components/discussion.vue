<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class = "prawy">
		<div class = "split2" v-if="chatid">
			<!-- Naglowek znajomego -->
			<div class = "naglowek_rozmowy">
				<div class = "nazwa_znajomego">
					<a>Mój znajomy</a>
				</div>
				<div class = ikony_znajomego">
					<div class = "Zmiana">
						<modal id="btn_zmiana" btn_class="btn_prawy">
						<template v-slot:button>
							<i class="material-icons">edit</i>
						</template>

						<p>Zmiana nazwy</p>
						</modal>
					</div>
					<!-- Blokowanie -->
					<div class = "blokowanie">
						<question id="btn_blok" btn_class="btn_prawy" @yes="console.log('TODO: blokowanie usera')">
						<template v-slot:button>
							<i class="material-icons">block</i>
						</template>

						<div>
							<p>Czy na pewno chcesz zablokować tego użytkownika?</p>
						</div>
						</question>
					</div>
					<!-- Usuwanie -->
					<div class = "Usuwanie">
						<question id="btn_usuw" btn_class="btn_prawy" @yes="console.log('TODO: usuwanie usera')">
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
				<div class="scrollbox">
					<template v-for="message in messages">
						<div v-bind:class="message.senderId === this.$root.authenticated.id ? 'wiadomosc_moja' : 'wiadomosc_znajomego'">
							<div class = "avatar">
								<span>{{ message.senderId }}</span>
							</div>
							<div class = "dymek">
								<div class = "dymek_znajomego">
									<p>{{ message.content }}</p>
								</div>
							</div>
						</div>
					</template>
					<div class="anchor"></div>
				</div>
			</div>
			<!-- Pisanie wiadomosci, wysylanie plikow, zdjec itp -->
			<div class = "wiadomosc">
				<form v-on:submit.prevent="sendMessage">
					<div class = "ikony_wiadomosci">
						<div class = "plik">
							<button class = "btn_lewy"><i class="material-icons">insert_drive_file</i></button>
						</div>
						<div class = "zdjecie">
							<button class = "btn_lewy"><i class="material-icons">add_photo_alternate</i></button>
						</div>
						<div class = "emoji">
							<button class = "btn_lewy"><i class="material-icons">insert_emoticon</i></button>
						</div>
					</div>
					<div class = "wpisywanie_wiadomosci">
						<input id="message_input" type = "text" placeholder = "Napisz wiadomosc..." v-model="message_text">
					</div>
					<div class = "ikony_wiadomosci">
						<div class = "wyslij">
							<button class = "btn_lewy"><i class="material-icons">send</i></button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="nochat" v-else>
			<h1>Welcome!</h1>
		</div>
	</div>
</template>

<script>
	module.exports = {
		components: {
			'modal': httpVueLoader('../components/modal.vue'),
			'question': httpVueLoader('../components/question.vue'),
		},
		props: ['chatid'],
		data: function() {
			return {
				messages: [],
				message_text: ''
			}
		},
		methods: {
			sendMessage: function() {
				stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": this.chatid,
					"messageType": "chat",
					"viewed": false,
					"content": this.message_text,
					"attachmentType": "none",
					"attachment": null,
					"loadingMode": false
				}));
			}
		}
	}
</script>
