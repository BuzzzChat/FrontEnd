<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="rejestracja">
		<div class="content">
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
			<form v-on:submit.prevent="submit">
				<div>
					<input type="text" placeholder="email" v-model="input.email">
				</div>
				<div>
					<input type="submit" value="Wyślij nowe hasło">
				</div>
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
					email: ''
				}
			}
		},
		methods: {
			submit: function(event) {
				this.errors = []
				// TODO: send to server
				this.errors.push('TODO: Wysłano...')
			}
		},
		mounted: function() {
			if (this.$root.authenticated) {
				this.$router.replace({ name: "main" });
			}
		}
	}
</script>
