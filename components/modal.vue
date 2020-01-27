<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<div>
		<button @click="showModal = !showModal" v-bind="$attrs" v-bind:class="btn_class">
			<slot name="button">
				TODO
			</slot>
		</button>
		<div class="modal" v-if="showModal">
			<div class="modal-content">
				<span class="close" @click="showModal = false">&times;</span>
				<div class="modal-srodek">
					<slot>
					Error
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				showModal: false
			}
		},
		inheritAttrs: false,
		props: ['btn_class']
	}
</script>
