<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div v-bind="$attrs">
		<div class="errors" v-if="errors.length">
			<p v-for="error in errors">
				{{ error }}
			</p>
		</div>
		<form v-on:submit.prevent="change">
			<input type="password" placeholder="Bieżące hasło" v-model="input.current">
			<input type="password" placeholder="Nowe hasło" v-model="input.password">
			<input type="password" placeholder="Powtórz nowe hasło" v-model="input.password2">
			<input type="submit" value="Zmień hasło">
		</form>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				errors: [],
				input: {
					current: '',
					password: '',
					password2: ''
				}
			}
		},
		methods: {
			change: function(event) {
				this.errors = []
				if (this.input.password != this.input.password2) {
					this.errors.push('Podano różne hasła')
					return
				}
				data = {
					userId: this.$root.authenticated.id,
					username: this.input.username,
					password: this.input.current,
					newPassword: this.input.password,
					newPasswordRepeat: this.input.password2
				}
				axios.post(
					this.$root.endpoint + '/management/changePassword',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					if (response.data.errorCode === 'correct') {
						this.errors.push('Zmieniono hasło')
					} else if (response.data.errorCode === 'wrong_credentials') {
						this.errors.push('Podane obecne hasło jest błędne')
					} else {
						this.errors.push('Wystąpił błąd. Spróbuj użyć inngo hasła.')
					}
				}, error => {
					this.errors.push('Problem z połączeniem. Spróbuj ponownie później')
				});
			}
		}
	}
</script>
