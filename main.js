const router = new VueRouter({
	routes: [
		{
			path: '/',
			name: 'start',
			component: httpVueLoader('./components/start.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: httpVueLoader('./components/login.vue')
		},
		{
			path: '/logout',
			redirect: { name: 'start' }
		},
		{
			path: '/register',
			name: 'register',
			component: httpVueLoader('./components/register.vue')
		}
	]
})

const app = new Vue({
	router,
	data: function() {
		return {
			authenticated: false,
			mockAccount: {
				username: "user",
				password: "user"
			}
		}
	},
	methods: {
		setAuthenticated(status) {
			this.authenticated = status;
		},
		logout() {
			this.authenticated = false;
		}
	// },
	// mounted() {
	// 	if (!this.authenticated) {
	// 		this.$router.replace({ name: "login" });
	// 	}
	}
}).$mount('#app')
