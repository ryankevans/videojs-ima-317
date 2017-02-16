var player = initPlayer({preload: 'auto', start: start});

function start() {
	player.ima.setContentWithAdTag(config.sources, getAdTag());
};
