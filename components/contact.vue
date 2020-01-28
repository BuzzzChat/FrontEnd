<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li @click="message">
		{{ friend.contact_name }}
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
				this.message_callback(friend.conversation_id, friend.contact_name)
			},
			remove: function() {
				data = {
					invitingUserId: this.$root.authenticated.id,
					invitedUserId: this.userid
				}
				axios.post(
					this.$root.endpoint + '/contact/addUser',
					data,
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					this.is_contact = true

					let conversationId = response.data.conversationId;
					console.log('conversation id:' + conversationId);
					stompClient.subscribe(`/channel/${conversationId}`, onMessageReceived);
					stompClient.send(`/app/chat/${this.$root.authenticated.id}/sendMessage`, {}, JSON.stringify({
						"senderId": this.$root.authenticated.id,
						"conversationId": conversationId,
						"messageType": "contact_removal",
						"viewed": false,
						"content": null,
						"attachmentType": "none",
						"attachment": null,
						"loadingMode": false
					}));
				}, error => {
					console.log('Problem z połączeniem')
				});
			}
		}
	}
</script>
