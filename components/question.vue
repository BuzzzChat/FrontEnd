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
					<div>
						<slot>
						ERROR
						</slot>
					</div>
					<div class="przyciski-modal">
						<div>
							<button class="hive" @click="yes(); showModal = false">TAK</button>
						</div>
						<div>
							<button class="hive" @click="showModal = false">NIE</button>
						</div>
					</div>
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
		methods: {
			yes: function() {
				this.$emit('yes');
			}
		},
		inheritAttrs: false,
		props: ['btn_class']
	}
</script>
