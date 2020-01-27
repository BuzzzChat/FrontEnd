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
			path: '/recover_password',
			name: 'password',
			component: httpVueLoader('./pages/password.vue')
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
			endpoint: 'http://147.135.210.97:81',
			axiosConfig: {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					"Access-Control-Allow-Origin": "*",
				}
			},
			channel: '',
			authenticated: false,
			mockAccount: {
				email: 'user',
				password: 'user'
			},
			initial: 'Ja'
		}
	},
	methods: {
		setAuthenticated(status) {
			console.log('authenticated:')
			console.log(status)
			this.authenticated = status
		},
		setUsername(value) {
			console.log('username:')
			console.log(value)
			if (this.authenticated) {
				this.authenticated.username = value
				this.initial = value.charAt(0)
			}
		},
		logout() {
			this.setAuthenticated(false)
			this.$router.replace({ name: 'logout' })
			console.log('logout')
		}
	}
}).$mount('#app')
