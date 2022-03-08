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
		SugarPresence: null,
		l10n: {
			stringAddPawn: '',
		}
	},
	mounted: function () {
		this.SugarL10n = this.$refs.SugarL10n;
		this.SugarPresence = this.$refs.SugarPresence;
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
			this.displayText = this.SugarL10n.get("Played", { name: this.currentenv.user.name });
		
			if (this.SugarPresence.isShared()) {
				var message = {
					user: this.SugarPresence.getUserInfo(),
					content: {
						action: 'update',
						data: this.currentenv.user.colorvalue
					}
				}
				this.SugarPresence.sendMessage(message);
			}
		},
		onNetworkDataReceived: function(msg) {
			switch (msg.content.action) {
				case 'init':
					this.pawns = msg.content.data;
					break;
				case 'update':
					this.pawns.push(msg.content.data);
					this.displayText = this.SugarL10n.get("Played", { name: msg.user.name });
					break;
			}
		},
		onNetworkUserChanged: function(msg) {
			// Handling only by the host
			if (this.SugarPresence.isHost) {
				this.SugarPresence.sendMessage({
					user: this.SugarPresence.getUserInfo(),
					content: {
						action: 'init',
						data: this.pawns
					}
				});
			}
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
		onJournalSharedInstance: function() {
			console.log("Shared instance");
		},
		onJournalLoadError: function(error) {
			console.log("Error loading from journal");
		},
		insertBackground: function () {
			var filters = [
			  { mimetype: 'image/png' }, 
			  { mimetype: 'image/jpeg' }
			];
			this.$refs.SugarJournal.insertFromJournal(filters)
			.then(function (data, metadata) {
				document.getElementById("app").style.backgroundImage = `url(${data})`;
			});
		},
	}
});
