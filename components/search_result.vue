<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li>
		<a @click="add">{{ username }}</a>
		{{ is_contact }}
	</li>
</template>

<script>
	module.exports = {
		props: ['username', 'userid', 'is_contact'],
		data: function() {
			return {
			}
		},
		methods: {
			add: function() {
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
						"messageType": "pending_request",
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
