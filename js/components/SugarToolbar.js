// Toolbar item
const SugarToolitem= {
	template: `
		<div class="splitbar" v-if="splitbar"/>
		<button 
			v-else 
			:id="id" 
			class="toolbutton" 
			:class="{ active: active }"
			:style="{ backgroundImage: icon ? 'url('+ icon +')' : '' }"
			v-bind="$attrs" 
			v-on="$listeners" 
			:disabled="disabled" 
		></button>
	`,
	props: {
		'id': String,
		'splitbar': Boolean,
		'paletteClass': String,
		'paletteFile': String,
		'paletteEvent': String,
		'paletteTitle': String,
		'disabled': Boolean,
		'active': Boolean,
		'icon': String
	},
	data() {
		return {
			paletteObject: null
		}
	},
	created: function () {
		// v-visible="condition" (Use this with palettes to avoid errors)
		app.directive('visible', function (el, binding) {
			el.style.visibility = !!binding.value ? 'visible' : 'hidden';
		});
	},
	mounted: function () {
		// Create palette if present
		var vm = this;
		if (vm.id && vm.paletteClass && vm.paletteFile) {
			requirejs([vm.paletteFile], function (palette) {
				vm.paletteObject = new palette[vm.paletteClass](document.getElementById(vm.id), vm.paletteTitle);
				if (vm.paletteEvent) {
					vm.paletteObject.addEventListener(vm.paletteEvent, function (event) {
						vm.$emit(vm.paletteEvent, event, vm.paletteObject);
					});
				}
			});
		}
	}
};

// Toolbar component
const SugarToolbar= {
	template: `
		<div id="main-toolbar" class="toolbar" v-bind:class="{ hidden: hidden }">
			<slot></slot>
		</div>
	`,
	data() {
		return {
			hidden: false
		}
	},
	methods: {
		isHidden() {
			return this.hidden;
		},

		// Handle fullscreen mode
		hide() {
			this.hidden = true;

		},

		show() {
			this.hidden = false;
		},
	}
};
