<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li @click="message">
		{{ friend.contact.contact_name }}
	</li>
</template>

<script>
	module.exports = {
		props: ['friend', 'message_callback'],
		data: function() {
			return {
			}
		},
		methods: {
			message: function() {
				this.message_callback(this.friend.contact.conversation_id, this.friend.contact.contact_name)
			}
		}
	}
</script>
