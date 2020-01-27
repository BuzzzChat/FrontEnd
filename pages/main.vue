<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class = "split">
		<!-- Lewa podstrona-znajomi, wyszukiwarka, ustawienia profilu i wylogowanie -->
		<div class = "lewy">
			<div class = "naglowek">
				<div class = "ikony_uzytkownika">
					<button id="btn_wyloguj" class="btn_lewy" @click="logout">
						<i class="material-icons">&#xe879;</i>
					</button>
				</div>
				<div class="user">
					<div class="avatar">
						<span>{{ initial }}</span>
					</div>
				</div>
				<div class = "ikony_uzytkownika">
					<!-- Edycja profilu -->
					<modal btn_class="btn_lewy" btn_id="btn_edycja">
						<template v-slot:button>
							<i class="material-icons">&#xe8b8;</i>
						</template>

						<!-- TODO: component -->
						<div class="gornyPasek">
							<p> Edycja profilu </p>
						</div>
						<div class="pole">
							<changenick class="pole-lewe"></changenick>
							<div class = "pole-prawe">
								<input type="password" placeholder="Bieżące hasło">
								<input type="password" placeholder="Nowe hasło">
								<input type="password" placeholder="Powtórz nowe hasło">
								<input type="submit" value="Zmień hasło">
							</div>
						</div>
					</modal>
				</div>
			</div>
			<!-- Wyszukiwarka -->
			<div class = "wyszukiwarka">
				<div class = "wpisywanie">
					<input type = "text" placeholder="Szukaj...">
				</div>
				<div class = "przycisk">
					<button class = "btn_lewy"><i class="material-icons">search</i></button>
				</div>
			</div>
			<!-- Znajomi -->
			<div class = "listy">
				<div class = "znajomi">
					<a> Znajomi</a>
				</div>
				<!-- Czat grupowy -->
				<div class = "czat_grupowy">
					<div class = "Grupowy_czat">
						<a>Czat grupowy </a>
						<a><i class="material-icons icon-text button">add</i></a>
					</div>
				</div>
				<!-- Zaproszenia -->
				<div class = "Zaproszenia">
					<a>Zaproszenia do znajomych</a>
				</div>
			</div>
		</div>
		<!-- Ekran rozmowy -->
		<div class = "prawy">
			<div class = "split2">
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
						<!-- przeniesione do JS -->
						<div class="anchor"></div>
					</div>
				</div>
				<!-- Pisanie wiadomosci, wysylanie plikow, zdjec itp -->
				<div class = "wiadomosc">
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
						<input id="message_input" type = "text" placeholder = "Napisz wiadomosc...">
					</div>
					<div class = "ikony_wiadomosci">
						<div class = "wyslij">
							<button class = "btn_lewy"><i class="material-icons">send</i></button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	module.exports = {
		components: {
			'modal': httpVueLoader('../components/modal.vue'),
			'question': httpVueLoader('../components/question.vue'),
			'changenick': httpVueLoader('../components/change_nick.vue'),
			'changepass': httpVueLoader('../components/change_pass.vue')
		},
		data: function() {
			return {
			}
		},
		computed: {
			initial: function() {
				return this.$root.initial;
			}
		},
		methods: {
			logout: function() {
				this.$root.logout()
			}
		},
		mounted: function() {
			if (!this.$root.authenticated) {
				this.$router.replace({ name: "start" });
			}
		}
	}
</script>
