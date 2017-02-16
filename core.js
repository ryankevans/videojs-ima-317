var config = {
    playerWidth: 640,
    playerHeight: 360,

    thumbnailUrl: 'https://googleads.github.io/videojs-ima/examples/posters/android.png',
    sources: [
      {
        type :'video/mp4',
        src: 'http://rmcdn.2mdn.net/Demo/vast_inspector/android.mp4'
      }
    ],

    // LKQD Offical Demo Tag: Desktop+Mobile In-Banner
    // -> http://demo.lkqd.com/formats.html
    adTagUrl: 'http://v.lkqd.net/ad?pid=21&sid=71907&formats=true&output=vastvpaid&support=html5&execution=inbanner&placement=&playinit=auto&volume=100&width=$$width$$&height=$$height$$&pageurl=$$url$$&rnd=$$random$$&m='
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

    Object.keys(macros).forEach(function(k) {
    	url = strReplaceAll(url, '$$' + k + '$$', macros[k]);
    });
    return url;
}

function createPlayer() {
	var dumbPlayer = document.createElement('video');
	dumbPlayer.id = 'content_video';
	dumbPlayer.className = 'video-js vjs-default-skin vjs-big-play-centered';
	dumbPlayer.setAttribute('width', config.playerWidth + 'px');
	dumbPlayer.setAttribute('height', config.playerHeight + 'px');
	var contentSrc = document.createElement('source');
	contentSrc.setAttribute('src', config.sources[0].src);
	contentSrc.setAttribute('type', config.sources[0].type);
	dumbPlayer.appendChild(contentSrc);
	var placeholder = document.getElementById('ima-sample-placeholder');
	placeholder.parentNode.appendChild(dumbPlayer);
	placeholder.parentNode.removeChild(placeholder);
	return 'content_video';
}

function initPlayer(options) {
	var playerId = createPlayer();

	var playerOptions = {
        preload: options.preload,
        controls: true,
        poster: config.thumbnailUrl
	};

	var player = videojs(playerId, playerOptions);
	player.ima({id: player.id()}, function() { player.ima.startFromReadyCallback(); });

	player.one('touchstart', function () {
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
