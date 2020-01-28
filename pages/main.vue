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
							<changepass class="pole-prawe"></changepass>
						</div>
					</modal>
				</div>
			</div>
			<!-- Wyszukiwarka -->
			<form v-on:submit.prevent="search" class="wyszukiwarka">
				<div class = "wpisywanie">
					<input type = "text" placeholder="Szukaj..." v-model="search_text">
				</div>
				<div class = "przycisk">
					<button class = "btn_lewy"><i class="material-icons">search</i></button>
				</div>
			</form>
			<div class="" v-if="search_results.length > 0 || search_text">
				<ul>
					<li><a v-on:click="clear_search">X</a></li>
					<searchresult v-for="result in search_results" :username="result.user.username" :userid="result.user.id" :is_contact="result.contact"></searchresult>
				</ul>
			</div>
			<div class = "listy" v-if="search_results.length < 1 && !search_text">
				<!-- Znajomi -->
				<div class = "znajomi">
					<a> Znajomi</a>
					<ul>
						<li v-for="friend in friends">
							{{ friend }}
						</li>
					</ul>
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
					<ul>
						<li v-for="friend in waiting">
							X:{{ friend.contact_name }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- Ekran rozmowy -->
		<discussion v-bind:chatid="chatid">
		</discussion>
	</div>
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
			'searchresult': httpVueLoader('../components/search_result.vue')
		},
		data: function() {
			return {
				chatid: 0,
				friends: [],
				waiting: [],
				search_results: [],
				search_text: ''
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
			},
			clear_search: function() {
				this.search_text = ''
				this.search_results = []
			},
			search: function() {
				data = {
					userId: this.$root.authenticated.id,
					searchValue: this.search_text
				}
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
			get_contacts: function() {
				data = {
					userId: this.$root.authenticated.id
				}
				axios.post(
					this.$root.endpoint + '/users/contactList',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log('get_contacts')
					console.log(response.data)
					friends = response.data
				}, error => {
					console.log('Problem z połączeniem')
				});
			},
			get_waiting: function() {
				data = {
					userId: this.$root.authenticated.id
				}
				axios.post(
					this.$root.endpoint + '/users/expectantContactList',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log('get_waiting')
					console.log(response.data)
					waiting = response.data
				}, error => {
					console.log('Problem z połączeniem')
				});
			}
		},
		mounted: function() {
			if (!this.$root.authenticated) {
				this.$router.replace({ name: "start" })
				return
			}
			init(this.$root.authenticated.id)
			this.get_contacts()
			this.get_waiting()
		}
	}
</script>
