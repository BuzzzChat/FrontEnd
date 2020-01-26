<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<h1>Main view</h1>
</template>

<script>
	module.exports = {
		mounted: function() {
			if (!this.$root.authenticated) {
				this.$router.replace({ name: "start" });
			}
		}
	}
</script>
