// Tutorial component based on bootstrap tour
Vue.component('sugar-tutorial', {
	data: function () {
		return {
			l10n: {
				stringTutoPrev: 'Prev',
				stringTutoNext: 'Next',
				stringTutoEnd: 'End',
			}
		}
	},
	mounted() {
		let vm = this;
		if (this.$root.$refs.SugarL10n) {
			this.$root.$refs.SugarL10n.$on('localized', function () {
				vm.$root.$refs.SugarL10n.localize(vm.l10n);
			});
		}
	},
	methods: {
		show: function (steps) {
				// console.log(steps);
				const driver = new Driver({
					allowClose: true,
					doneBtnText: 'Done',
					closeBtnText: 'Skip',     
					nextBtnText: 'Next',              
					prevBtnText: 'Prev',
				});
				driver.defineSteps(steps);
				driver.start();

				event.stopPropagation();
		}
	}
});
