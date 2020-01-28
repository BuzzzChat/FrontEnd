<!-- vim: set tabstop=2 shiftwidth=2 noexpandtab: -->
<template>
	<li>
		{{ friend.contact_name }}
		<a @click="add">+</a>
		<a @click="reject">-</a>
	</li>
</template>

<script>
	module.exports = {
		props: ['friend', 'callback'],
		data: function() {
			return {
			}
		},
		methods: {
			add: function() {
				let conversationId = this.friend.conversation_id;
				stompClient.subscribe(`/channel/${conversationId}`, onMessageReceived);
				stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": conversationId,
					"messageType": "accepting_request"
				}));
				this.callback()
			},
			reject: function() {
				let conversationId = this.friend.conversation_id;
				stompClient.subscribe(`/channel/${conversationId}`, onMessageReceived);
				stompClient.send(`/app/chat/${conversationId}/sendMessage`, {}, JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": conversationId,
					"messageType": "rejecting_request"
				}));
				this.callback()
			}
		}
	}
</script>
