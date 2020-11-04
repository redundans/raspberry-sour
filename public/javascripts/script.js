var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		logs: [],
		recipes: [],
		form: [
		{
			"datetime": "",
			"temp": ""
		}
		],
		error: false,
		showForm: false,
	},
	mounted () {
		axios.get("/logs")
			.then(response => {this.logs = response.data});
		axios.get("/recipes")
			.then(response => {this.recipes = response.data });
	},
	methods: {
		setActivatedRecipe: function (id) {
			axios.post("/recipes", { _id: id })
				.then(response => {this.recipes = response.data });
		},
	},
	filters: {
		moment: function (date) {
			return moment(date).format('D MMMM – hh:mm');
		}
	}
})