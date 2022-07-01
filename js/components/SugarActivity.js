const SugarActivity= {
	name: 'SugarActivity',
	data() {
		return {
			activity: null,
			environment: null
		}
	},
	mounted() {
		var vm = this;
		requirejs(["sugar-web/activity/activity", "sugar-web/env"], function (activity, env) {
			vm.activity = activity;
			console.log(env.getEnvironment);
			env.getEnvironment(function (err, environment) {
				vm.environment = environment;
				activity.setup();
				// console.log("inside getEnvirnment function!");
				// console.log(environment);
				vm.$emit('initialized');
			});
		});
	},
	methods: {
		getActivity() {
			return this.activity;
		},

		getEnvironment() {
			return this.environment;
		}
	}
}