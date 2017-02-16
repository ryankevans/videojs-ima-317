var config = {
	playerId: 'content_video',
    playerWidth: 640,
    playerHeight: 360,

    thumbnailUrl: './assets/android.png',
    sources: [{
	    type :'video/mp4',
	    src: './assets/android.mp4'
    }],

    // LKQD Offical Demo Tag: Desktop+Mobile In-Banner
    // -> http://demo.lkqd.com/formats.html
    adTagUrl: '//v.lkqd.net/ad?pid=21&sid=71907&formats=true&output=vastvpaid&support=html5&execution=inbanner&placement=&playinit=auto&volume=100&width=$$width$$&height=$$height$$&pageurl=$$url$$&rnd=$$random$$&m='
};

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function strReplaceAll(haystack, needle, value) {
	var regex = new RegExp(regexEscape(needle), 'g');
	return haystack.replace(regex, value);
}

function populateAdTagMacros(url) {
	var macros = {
	    'height': config.playerHeight,
	    'width': config.playerWidth,
	    'random': Math.floor(Math.random() * 100000000),
	    'url': 'http://demo.lkqd.com'
	};
	$.each(macros, function(k, v) {
    	url = strReplaceAll(url, '$$' + k + '$$', v);
    });
    return url;
}

function createPlayer() {
	var dumbPlayer = $('<video>', {
		id: config.playerId,
		class: 'video-js vjs-default-skin vjs-big-play-centered',
		width: config.playerWidth + 'px',
		height: config.playerHeight + 'px'
	});
	var contentSrc = $('<source>', {
		src: config.sources[0].src,
		type: config.sources[0].type
	});
	dumbPlayer.append(contentSrc);
	$('#ima-sample-placeholder').after(dumbPlayer).remove();
}

function initPlayer(options) {
	createPlayer();
	var playerOptions = {
        preload: options.preload,
        controls: true,
        poster: config.thumbnailUrl
	};

	var player = videojs(config.playerId, playerOptions);
	player.ima({id: player.id()}, function() { player.ima.startFromReadyCallback(); });

	player.one('click', function () {
		if (options.start) { options.start(player); }
		player.ima.requestAds();
		player.ima.initializeAdDisplayContainer();
		player.play();
	});
	return player;
}

function getAdTag() { return populateAdTagMacros(config.adTagUrl); }

// EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
window.config = config;
window.getAdTag = getAdTag;
window.initPlayer = initPlayer;
