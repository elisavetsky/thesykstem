Vue.createApp({
	compilerOptions: {
		delimiters: ["${%", "%}"]
	  },
	delimiters: ['${%', '%}'],
	data() {return {'message: 'Ciao''}},
}).mount('#demo');