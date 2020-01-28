<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li @click="message">
		{{ friend.contact.contact_name }}
		<a @click="remove">x</a>
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
				// To sypie crashami wiec zakomentowałem
				//this.message_callback(friend.conversation_id, friend.contact_name)
			},
			remove: function() {
				// tu trzeba się odnieść do klikniętego kontaktu i wyciągnąć z niego conversationId

				//let conversationId =
				console.log('conversation id:' + conversationId);
				stompClient.send(`/app/chat/${this.$root.authenticated.id}/sendMessage`, {}, JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": conversationId,
					"messageType": "pending_request",
					"viewed": false,
					"content": null,
					"attachmentType": "none",
					"attachment": null,
					"loadingMode": false
				}));
			}
		}
	}
</script>
