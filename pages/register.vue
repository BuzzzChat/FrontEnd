<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<div class="content">
			<form v-on:submit.prevent="register">
				<h1> Rejestracja </h1>
				<div class="errors" v-if="errors.length">
					<p v-for="error in errors">
						{{ error }}
					</p>
				</div>
				<div>
					<input type="text" placeholder="Nazwa użytkownika" v-model="input.login">
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
				Zapoznałem się z <a href="#">regulaminem</a><input type="checkbox" v-model="input.consent">
				<br>
				<input type="submit" value="Utwórz konto">
			</form>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				errors: [],
				input: {
					login: '',
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
				// TODO: send to server
				if (this.input.password != this.input.password2) {
					this.errors.push('Wprowadzono 2 różne hasła')
					return
				}
				this.$emit('authenticated', true)
				this.$router.replace({ name: 'main' })
			}
		},
		mounted: function() {
			if (this.$root.authenticated) {
				this.$router.replace({ name: "main" });
			}
		}
	}
</script>
