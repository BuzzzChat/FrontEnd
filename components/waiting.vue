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
		props: ['friend', 'callback', 'clicked', 'message_callback'],
		data: function() {
			return function () {
				this.clicked = false;
			}
		},
		methods: {
			add: function() {
				let conversationId = this.friend.conversation_id;
				this.$parent.chatid = this.friend.conversation_id;
				let message = JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": conversationId,
					"messageType": "accepting_request",
					"viewed": false,
					"content": null,
					"attachmentType": "none",
					"attachment": null,
					"loadingMode": false
				});
				let self = this;
				stompClient.subscribe(`/channel/${'user'+this.friend.contact_user_id}`, function () {
					self.$parent.refresh();
				});
				stompClient.send(`/app/chat/${'user'+this.friend.contact_user_id}/sendMessage`, {}, message);
				this.messages = this.$parent.messages;
				this.message_callback(this.friend.conversation_id, this.friend.contact_name, this.friend.contacting_user_id);
				this.$parent.refresh();
				this.callback();
			},
			reject: function() {
				for(let i = this.$parent.waiting .length - 1; i >= 0; i--) {
					if(this.$parent.waiting[i].contact_user_id === this.friend.contact_user_id) {
						this.$parent.waiting.splice(i, 1);
					}
				}

				let conversationId = this.friend.conversation_id;
				let message = JSON.stringify({
					"senderId": this.$root.authenticated.id,
					"conversationId": conversationId,
					"messageType": "rejecting_request",
					"viewed": false,
					"content": null,
					"attachmentType": "none",
					"attachment": null,
					"loadingMode": false
				});
				stompClient.send(`/app/chat/${'user'+this.friend.contact_user_id}/sendMessage`, {}, message);
				this.messages = this.$parent.messages;
			}
		}
	}
</script>
