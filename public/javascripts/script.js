var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		logs: [],
		stamps: [],
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
		axios.get("/stamps")
		.then(response => {this.stamps = response.data });
	},
	methods: {
		submitForm: function (e) {
			e.preventDefault();
			let error = false;
			this.form.forEach((input) => {
				if ( !input.temp || !input.datetime ) {
					error = "There is some errors in the form below!";
				} 
			});
			this.error = error;
			if ( ! this.error ) {
				axios.put("/stamps", this.form);
				axios.put("/logs", []);
				this.logs = [];
				this.form = [
				{
					"datetime": "",
					"temp": ""
				}
				];
				this.showForm = false;
			}
		},
		addToForm: function (e) {
			this.form.push({
				"datetime": "",
				"temp": ""
			});
		},
		deleteFromForm: function(index) {
			this.form.splice(index, 1);
		},
		sorted: function(arr) {
			return arr.slice().sort(function(a, b) {
				return new Date(a.datetime) - new Date(b.datetime);
		    });
		}
	}
})