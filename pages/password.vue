<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<form v-on:submit.prevent="submit" class="content">
			<div class="obrazek">
				<img src="bee.png" width="300" height="300">
			</div>			
			<h1>Zapomniałem hasła</h1>  
			<div class="errors" v-if="errors.length">
				<p v-for="error in errors">
				{{ error }}
				</p>
			</div>
			<p>Podaj swoj email</p>
			<div>
				<input type="text" placeholder="email" v-model="input.email">
			</div>
			<div>
				<input type="submit" value="Wyślij nowe hasło">
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
					email: ''
				}
			}
		},
		methods: {
			submit: function(event) {
				this.errors = []
				data = {
					email: this.input.email
				}
				axios.post(
					this.$root.endpoint + '/management/remindPassword',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					if (response.data.errorCode === 'correct') {
						this.errors.push('Na podany adres został wysłany link resetujący hasło.')
					} else {
						this.errors.push('Podano niepoprawne dane.')
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
