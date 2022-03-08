// Rebase require directory
requirejs.config({
	baseUrl: "lib",
	paths: {
		activity: "../js"
	}
});

// Vue main app
var app = new Vue({
	el: '#app',
	components: {
		'pawn': Pawn
	},
	data: {
		displayText: '',
		currentenv: null,
		pawns: [],
		SugarL10n: null,
		l10n: {
			stringAddPawn: '',
		}
	},
	mounted: function () {
		this.SugarL10n = this.$refs.SugarL10n;
	},
	methods: {
		initialized: function () {
			// Sugarizer initialized
			this.currentenv = this.$refs.SugarActivity.getEnvironment();
		},
		// Handles localized event
		localized: function () {
			this.displayText = this.SugarL10n.get("Hello",  {name: this.currentenv.user.name});
			this.SugarL10n.localize(this.l10n);
		},
		onAddClick: function () {
			this.pawns.push(this.currentenv.user.colorvalue);
			this.displayText = this.SugarL10n.get("Played", {name: this.currentenv.user.name });
		},
		onStop: function () {
			// Save current pawns in Journal on Stop
			var context = {
				pawns: this.pawns
			};
			this.$refs.SugarJournal.saveData(context);
		},
		onJournalNewInstance: function() {
			console.log("New instance");
		},
		
		onJournalDataLoaded: function (data, metadata) {
			console.log("Existing instance");
			this.pawns = data.pawns;
		},
		
		onJournalLoadError: function(error) {
			console.log("Error loading from journal");
		},
	}
});
