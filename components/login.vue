<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<div class="content">
			<div class="obrazek">
				<img src="bee.png" width="300" height="300">
			</div>
			<h1>Logowanie</h1>
			<form v-on:submit.prevent="login">
				<div>
					<input type="text" placeholder="Login" v-model="input.login">
				</div>
				<div>
					<input type="password" placeholder="Password" v-model="input.password">
				</div>
				<div>
					<input type="submit" value="Zaloguj się">
				</div>
			</form>
			<div>
				<a href="przypomnijHaslo.html">Zapomniałem hasła</a>
			</div>
			<div>
				<router-link to="/register">
					<input type="submit" value="Utwórz konto">
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				input: {
					login: '',
					password: ''
				}
			}
		},
		methods: {
			login: function(event) {
				// TODO: send to server
				if (this.input.login == this.$root.mockAccount.login
					&& this.input.password == this.$root.mockAccount.password) {
					this.$emit('authenticated', true)
					this.$router.replace({ name: 'main' })
				}
			}
		},
		mounted: function() {
			if (this.$root.authenticated) {
				this.$router.replace({ name: "main" });
			}
		}
	}
</script>
