<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<form class="content" v-on:submit.prevent="login" ref="form">
			<div class="obrazek">
				<img src="bee.png" width="300" height="300">
			</div>
			<h1>Logowanie</h1>
				<div class="errors" v-if="errors.length">
					<p v-for="error in errors">
						{{ error }}
					</p>
				</div>
				<div>
					<input type="email" placeholder="Login" autofocus v-model="input.email" ref="email">
				</div>
				<div>
					<input type="password" placeholder="Password" v-model="input.password">
				</div>
				<div>
					<button class="hive" @click="this.$refs.form.submit()">Zaloguj się</button>
				</div>
			<div>
				<router-link :to="{ name: 'password' }">Zapomniałem hasła</router-link>
			</div>
			<div>
				<router-link :to="{ name: 'register' }">
					<button class="hive">Utwórz konto</button>
				</router-link>
			</div>
		</form>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				errors: [],
				input: {
					email: '',
					password: ''
				}
			}
		},
		methods: {
			login: function(event) {
				this.errors = []
				data = {
					email: this.input.email,
					password: this.input.password
				}
				axios.post(
					this.$root.endpoint + '/management/loginUser',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					if (response.data.errorCode != 'correct') {
						this.errors.push('Podano niepoprawne dane logowania')
					} else {
						this.$emit('authenticated', response.data.user)
						this.$router.replace({ name: 'main' })
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
			this.$refs.email.focus()
		}
	}
</script>
