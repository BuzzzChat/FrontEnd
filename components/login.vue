<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<div class="content">
			<div class="obrazek">
				<img src="bee.png" width="300" height="300">
			</div>
			<h1>Logowanie</h1>
			<form>
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
			status: '',
			input: {
				username: '',
				password: ''
			}
        }
    },
	methods: {
		login: function(event) {
			// TODO: send to server
			if (this.input.username == this.mockAccount.username
				&& this.input.password == this.mockAccount.password) {
				this.$emit('authenticated', true);
				this.$router.replace({ name: 'start' });
				this.status = 'ok'
			} else {
				this.status = 'failed'
			}
		}
	}
}
</script>

<style>
.hello {
    background-color: #fdd;
}
</style>
