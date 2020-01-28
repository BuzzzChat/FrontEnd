<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div class="start">
		<div class="split_start">
			<div class="lewy_start">
				<div>
					<h2>Czym jest Buzzz?</h2>
				</div>
				<div class="tekst">
					<p>Buzzz to komunikator internetowy umożliwiający prowadzenie prywatnych rozmów.</p>
					<p>Jeśli chcesz wysyłać zaszyfrowane, nieczytane przez nikogo wiadomości, zdjęcia czy pliki, Buzz jest dla Ciebie idealnym wyborem. </p>
					<p>Możesz z niego korzystać w najwygodniejszy dla siebie sposób na - telefonie komórkowym, komputerze lub tablecie. Wystarczy, że Twoje urządzenie posiada przeglądarkę internetową i dostęp do sieci, a bezpieczna rozmowa jest w zasięgu Twojej ręki!</p>
				</div>
			</div>
			<div class ="prawy_start">
				<div class="obrazek">
					<img src="bee.png" width="300" height="300">
				</div>
				<div>
					<router-link :to="{ name: 'login' }">
						<button class="hive" ref="login">Zaloguj się</button>
					</router-link>
				</div>
				<div>
					<router-link :to="{ name: 'register' }">
						<button class="hive">Utwórz konto</button>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		mounted: function() {
			if (this.$root.authenticated) {
				this.$router.replace({ name: "main" });
			}
			this.$refs.login.focus()
		}
	}
</script>
