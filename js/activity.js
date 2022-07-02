// Rebase require directory
requirejs.config({
	baseUrl: "lib",
	paths: {
		activity: "../js"
	}
});

// Vue main app
const app = Vue.createApp({
	// el: '#app',
	components: {
		'pawn': Pawn,
		'sugar-toolitem': SugarToolitem,
		'sugar-toolbar': SugarToolbar,
		'sugar-activity': SugarActivity,
		'sugar-journal': SugarJournal,
		'sugar-localization': SugarLocalization,
		'sugar-presence': SugarPresence,
		'sugar-tutorial': SugarTutorial,
	},
	data() {
		return {
			displayText: '',
			currentenv: null,
			pawns: [],
			SugarL10n: null,
			SugarPresence: null,
			l10n: {
				stringAddPawn: '',
				stringTutoExplainTitle: '',
				stringTutoExplainContent: '',
				stringTutoAddTitle: '',
				stringTutoAddContent: '',
				stringTutoBackgroundTitle: '',
				stringTutoBackgroundContent: '',
			}
		}
	},
	mounted() {
		console.log("inside app mounted()");
		this.SugarL10n = this.$refs.SugarL10n;
		this.SugarPresence = this.$refs.SugarPresence;
	},
	methods: {
		initialized() {
			// Sugarizer initialized
			this.currentenv = this.$refs.SugarActivity.getEnvironment();
		},
		// Handles localized event
		localized() {
			this.displayText = this.SugarL10n.get("Hello",  {name: this.currentenv.user.name});
			this.SugarL10n.localize(this.l10n);
		},
		onAddClick(event) {
			for (var i = 0; i < event.count; i++) {
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
			}
		},
		onNetworkDataReceived(msg) {
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
		onNetworkUserChanged(msg) {
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
		onHelp() {
			var steps= [{
				title: this.l10n.stringTutoExplainTitle,
				intro: '<img src="./icons/pawn-icon.svg"><img/>'+this.l10n.stringTutoExplainContent
			  },
			  {
				element: '#add-button',
				position: 'right',
				title: this.l10n.stringTutoAddTitle,
				intro: this.l10n.stringTutoAddContent
			  },
			  {
				element: '#insert-button',
				position: 'bottom',
				title: this.l10n.stringTutoBackgroundTitle,
				intro: this.l10n.stringTutoBackgroundContent
			  }];
			this.$refs.SugarTutorial.show(steps);
		},
		onStop() {
			// Save current pawns in Journal on Stop
			var context = {
				pawns: this.pawns
			};
			this.$refs.SugarJournal.saveData(context);
		},
		onJournalNewInstance() {
			console.log("New instance");
		},
		onJournalDataLoaded(data, metadata) {
			console.log("Existing instance");
			this.pawns = data.pawns;
		},
		onJournalSharedInstance() {
			console.log("Shared instance");
		},
		onJournalLoadError(error) {
			console.log("Error loading from journal");
		},
		insertBackground() {
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

console.log(app);
app.mount('#app');