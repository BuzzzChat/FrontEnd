<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<form class="content" v-on:submit.prevent="register">
			<h1> Rejestracja </h1>
			<div class="errors" v-if="errors.length">
				<p v-for="error in errors">
				{{ error }}
				</p>
			</div>
			<div>
				<input type="text" placeholder="Nazwa użytkownika" v-model="input.username">
			</div>
			<div>
				<input type="text" placeholder="Adres E-mail" v-model="input.email">
			</div>
			<div>
				<input type="password" placeholder="Hasło" v-model="input.password">
			</div>
			<div>
				<input type="password" placeholder="Powtórz hasło" v-model="input.password2">
			</div>
			Mam ukończone 18 lat <input type="checkbox" v-model="input.age">
			<br>
			Zapoznałem się z <a href="./RegulaminBuzzz.pdf">regulaminem</a><input type="checkbox" v-model="input.consent">
			<br>
			<input type="submit" value="Utwórz konto">
		</form>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				errors: [],
				input: {
					username: '',
					email: '',
					password: '',
					password2: '',
					age: false,
					consent: false
				}
			}
		},
		methods: {
			register: function(event) {
				this.errors = []
				if (this.input.password != this.input.password2) {
					this.errors.push('Wprowadzono 2 różne hasła')
				}
				if (!this.input.age) {
					this.errors.push('Wróć po ukończeniu 18 lat')
				}
				if (!this.input.consent) {
					this.errors.push('Przeczytaj i zaakceptuj regulamin')
				}
				if (this.errors.length)
					return
				data = {
					username: this.input.username,
					email: this.input.email,
					password: this.input.password
				}
				axios.post(
					this.$root.endpoint + '/management/registerUser',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					if (response.data.errorCode === 'correct') {
						this.$emit('authenticated', response.data.user)
						this.$router.replace({ name: 'main' })
					} else if (response.data.errorCode === 'occupied_username') {
						this.errors.push('Nazwa użytkownika jest już zajęta')
					} else if (response.data.errorCode === 'occupied_email') {
						this.errors.push('Adres email jest już używany')
					} else {
						this.errors.push('Wystąpił błąd');
					}
				}, error => {
					this.errors.push('Problem z połączeniem. Spróbuj ponownie później')
				});
			}
		},
		mounted: function() {
			if (this.$root.authenticated) {
				this.$router.replace({ name: "main" });
			}
		}
	}
</script>
