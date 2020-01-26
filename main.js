const router = new VueRouter({
	routes: [
		{
			path: '/start',
			name: 'start',
			component: httpVueLoader('./pages/start.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: httpVueLoader('./pages/login.vue')
		},
		{
			path: '/logout',
			name: 'logout',
			redirect: { name: 'start' }
		},
		{
			path: '/register',
			name: 'register',
			component: httpVueLoader('./pages/register.vue')
		},
		{
			path: '/',
			name: 'main',
			component: httpVueLoader('./pages/main.vue')
		},
		{
			path: '*',
			redirect: { name: 'start' }
		}
	]
})

const app = new Vue({
	router,
	data: function() {
		return {
			authenticated: false,
			mockAccount: {
				login: 'user',
				password: 'user'
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
