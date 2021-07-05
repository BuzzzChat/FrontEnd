<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<form v-on:submit.prevent="change">
		<div class="errors" v-if="errors.length">
			<p v-for="error in errors">
			{{ error }}
			</p>
		</div>
		<input type="text" placeholder="Nowy nick" v-model="input.username">
		<input type="submit" value="Zmień nick">
	</form>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				errors: [],
				input: {
					username: ''
				}
			}
		},
		methods: {
			change: function(event) {
				this.errors = [];
				data = {
					userId: this.$root.authenticated.id,
					username: this.input.username,
				};
				axios.post(
					this.$root.endpoint + '/management/changeUsername',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					if (response.data.errorCode === 'correct') {
						this.errors.push('Zmieniono nazwę użytkownika');
						this.$root.setUsername(response.data.user.username)
					} else if (response.data.errorCode === 'occupied_username') {
						this.errors.push('Nazwa użytkownika jest już zajęta')
					} else {
						this.errors.push('Wystąpił błąd. Spróbuj użyć innej nazwy użytkownika.')
					}
				}, error => {
					this.errors.push('Problem z połączeniem. Spróbuj ponownie później')
				});
			}
		}
	}
</script>
