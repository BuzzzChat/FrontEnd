<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li @click="message">
		{{ friend.contact.contact_name }}
	</li>
</template>

<script>
	module.exports = {
		props: ['friend', 'message_callback'],
		data: function () {
			return {

			}
		},
		methods: {
			message: function() {
				this.message_callback(this.friend.contact.conversation_id, this.friend.contact.contact_name, this.friend.contact.contacting_user_id);
				this.$parent.contactName = this.friend.contact.contact_name;
				this.$parent.contacting_user_id = this.friend.contact.contacting_user_id;
				this.$parent.refresh();
			},
		}
	}
</script>
