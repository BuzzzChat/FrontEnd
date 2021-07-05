<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li>
		{{ username }} <a v-if="!is_contact" @click="add">+</a>
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
				axios.post(
					this.$root.endpoint + '/contact/addUser',
					{
						invitingUserId: this.$root.authenticated.id,
						invitedUserId: this.userid
					},
					this.$root.axiosConfig
				).then(response => {
					console.log(response.data);
					this.is_contact = true;

					let conversationId = response.data.conversationId;
					console.log('conversation id:' + conversationId);
					let privateChannel = 'user' + this.userid;
					stompClient.send(`/app/chat/${privateChannel}/sendMessage`, {}, JSON.stringify({
						"senderId": this.$root.authenticated.id,
						"conversationId": conversationId,
						"messageType": "pending_request",
						"viewed": false,
						"content": null,
						"attachmentType": "none",
						"attachment": null,
						"loadingMode": false
					}));
					this.$parent.refresh();
				}, error => {
					console.log('Problem z połączeniem')
				});
			}
		}
	}
</script>
