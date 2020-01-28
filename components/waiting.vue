<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li>
		{{ username }} <a @click="add">+</a>
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
				}, error => {
					console.log('Problem z połączeniem')
				});
			},
			performDynamicAction: function(conversationId, userId, type) {
				stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
					"senderId": userId,
					"conversationId": conversationId,
					"messageType": type,
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
