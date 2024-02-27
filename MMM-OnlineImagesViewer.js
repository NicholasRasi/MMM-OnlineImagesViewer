/* global Module */

Module.register("MMM-OnlineImagesViewer",{
	defaults: {
		opacity: 1,
		animationSpeed: 500,
		updateInterval: 60000,
		maxWidth: "100%",
		maxHeight: "100%",
		showAll: true,
		random: false,
		numColumns: 3
	},

	start: function() {
		var self = this;
		this.images = this.config.images;
		Log.info(this.config.updateInterval);
		this.loaded = false;
		this.lastImageIndex = 0;
		this.gridColumns = Array(this.config.numColumns).fill('auto').join(' ');

		// Schedule update timer
		setInterval(function() {
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);

	},

	randomIndex: function(images) {
		if (images.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * images.length);
		};

		var ImageIndex = generate();
		while (this.images.length > 1 && ImageIndex == this.lastImageIndex) {
			ImageIndex = generate();
		}
		this.lastImageIndex = ImageIndex;

		return ImageIndex;
	},

	randomPhoto: function() {
		var images = this.images;
		var index = this.randomIndex(images);

		return images[index];
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.style.display = "grid";
		wrapper.style.gridTemplateColumns = this.gridColumns;
		
		if (this.config.showAll) {
			this.images.forEach(photoImageUrl => {
				this.appendImage(wrapper, photoImageUrl);
			});
		} else {
			if (this.config.random) {
				var photoImageUrl = this.randomPhoto();
			} else {
				var photoImageUrl = this.images[this.lastImageIndex];
				this.lastImageIndex = (this.lastImageIndex+1) % this.images.length;
			}

			this.appendImage(wrapper, photoImageUrl);
		}
		return wrapper;
	},

	appendImage: function(wrapper, photoImageUrl) {
		var img = document.createElement("img");
		// get the photo image url and add a t parameter
		let imgSrcURL = new URL(photoImageUrl);
		imgSrcURL.searchParams.append('t', new Date().getTime());
		img.src = imgSrcURL.href;
		img.style.maxWidth = this.config.maxWidth;
		img.style.maxHeight = this.config.maxHeight;
		img.style.opacity = this.config.opacity;
		wrapper.appendChild(img);
	},

	getScripts: function() {
		return ["MMM-OnlineImagesViewer.css"]
	},
});
