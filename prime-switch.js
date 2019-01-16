// pv shortcut means "prime video"
var _debug              = 0;
var version             = '0.5';
var version_file        = 'https://raw.githubusercontent.com/eifeldriver/prime-switch/master/version';
var pv_timer            = null;
var watcher             = null;
var is_loading          = null;
var selector_vidthumb   = '.DigitalVideoWebNodeStorefront_Card__CardWrapper';
var selector_spinner    = '.DigitalVideoUI_Spinner__spinner';


/**
 * debug function
 */
function pv_debug(txt) {
    if (_debug) {
        var d = new Date();
        var now = [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()].join(':');
        console.log(now + ': ' + txt);
    }
}


/**
 * insert custom CSS
 *
 */
function insertCss() {
    var css     =   '' +
        '#pv-switch-wrapper { position: fixed; z-index: 999; top: 5px; left: 1px; } ' +
        '#pv-switch { background: #999; color: #333; } ' +
        '#pv-switch.active { background: green; color: white; } ' +
        '#prime-switch-update { position: absolute; top: 0; right:0; transform: translate(50%, -50%);  } ' +
        '#prime-switch-update span { ' +
        '  line-height: 20px; width: 75px; border-radius: 50%; padding: 0; ' +
        '  font-size: 0px; padding: 4px; border: 1px solid lightgreen; background: red; ' +
        '} ' +
        '.flashit {  color:#f2f; animation: flash linear 3s 3; } ' +
        '  @keyframes flash { 0% { opacity: 1; } 70% { opacity: .1; } 100% { opacity: 1; } }' +
        '.card-on  { display: inline-block; }' +
        '.card-off { display: none !important; } ' +
        '.cat-off { display: none !important; } ';
    var style   = document.createElement('STYLE');
    style.innerHTML = css;
    document.querySelector('head').appendChild(style);
}

/**
 * hide all thumbnails
 *
 */
function disableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector_vidthumb);
    if (pv_thumbs) {
        for(var idx=0; idx<pv_thumbs.length; idx++) {
            pv_thumbs[idx].className = pv_thumbs[idx].className.replace(' card-on', '') + ' card-off';
        }
    }
    enableAllCategories();
}

/**
 * show all thumbnails
 *
 */
function enableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector_vidthumb);
    if (pv_thumbs) {
        for(var idx=0; idx<pv_thumbs.length; idx++) {
            pv_thumbs[idx].className = pv_thumbs[idx].className.replace(' card-on', '').replace(' card-off', '') + ' card-on';
        }
    }
    enableAllCategories();
}

/**
 * enable only thumbnails on Prime included items
 *
 */
function enableOnlyPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector_vidthumb + ' .DigitalVideoUI_Logo__primeSash, ' + selector_vidthumb + ' .DigitalVideoWebNodeStorefront_Card__primeBadge');
    if (pv_thumbs) {
        for (var idx=0; idx<pv_thumbs.length; idx++) {
            var vid = pv_thumbs[idx].closest(selector_vidthumb);
            vid.className = vid.className.replace(' card-off', ' card-on');
        }
    }
    hideEmptyCategories();
}

/**
 * disable all empty categories (means without any Prime included video)
 */
function hideEmptyCategories() {
    var cats = document.querySelectorAll('.DigitalVideoWebNodeStorefront_Collection__Collection');
    for (var idx=0; idx<cats.length; idx++) {
        var cat = cats[idx];
        if (cat.querySelectorAll('.card-on').length == 0) {
            // no visible thumb found
            cat.className += ' cat-off';
        }
    }
}

/**
 * makes any category visible
 */
function enableAllCategories() {
    var cats = document.querySelectorAll('.DigitalVideoWebNodeStorefront_Collection__Collection');
    for (var idx=0; idx<cats.length; idx++) {
        var cat = cats[idx];
        cat.className = cat.className.replace(' cat-off', '');
    }
}

/**
 * toggle filter on / off
 *
 */
function togglePvOnly() {
    var btn = document.querySelector('#pv-switch');
    if (btn) {
        if (btn.className.indexOf(' active') >= 0) {
            // show all thumbs
            btn.className = btn.className.replace(' active', ''); //?
            enableAllPvThumbs();
            
        } else {
            // show only Prime Thumbs
            disableAllPvThumbs();
            enableOnlyPvThumbs();
            btn.className += ' active';
        }
    }
}

/**
 * check Github version with local version
 */
function checkForUpdates() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', version_file);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var repo_version = xhr.responseText;
            if (version.trim() != repo_version.trim()) {
                // other version available
                var info        = document.createElement('DIV');
                info.id         = 'prime-switch-update';
                info.className  = 'flashit';
                info.innerHTML  = '<span title="Your version = ' + version + ' | New version = ' + repo_version + '">*</span>';
                var btn = document.querySelector('#pv-switch');
                btn.appendChild(info);
            }
        } else {
            return null;
        }
    };
    xhr.send();
}

/**
 * add filter button to top navigation
 *
 */
function createPvButton() {
    var div         = document.createElement('DIV');
    div.id          = 'pv-switch-wrapper';
    div.innerHTML   = '<button id="pv-switch">Prime only</button>';
    document.querySelector('#navbar').appendChild(div);
    document.querySelector('#pv-switch').addEventListener('click', togglePvOnly);
}

/**
 * update filtered view
 *
 */
function refreshPvFilter() {
    // update view after scrolling and dynamic loads
    disableAllPvThumbs();
    enableOnlyPvThumbs();
}

/**
 * simple check for dynamic reload is running
 */
function isDynLoading() {
    // DOM element only exists on running reload
    return document.querySelectorAll(selector_spinner).length;
}

function watchDynReloading() {
    pv_debug('is_loading = ' + is_loading ? '1' : '0');
    if (isDynLoading()) {
        is_loading = 1;
        pv_debug('re-loading running');

    } else {
        if (is_loading) {
            // reload finished
            is_loading = 0;
            pv_debug('loading finished');
            refreshPvFilter();
            initWatcher();
        } else {
            pv_debug('still watching');
        }
    }
}

function initWatcher() {
    window.clearInterval(watcher);
    pv_debug('watcher cleared');
    watcher = window.setInterval(watchDynReloading, 1000);
    pv_debug('watcher installed');
}

/**
 * watch for new loaded items after scrolling
 *
 */
function initDomObserver() {
    var div = document.querySelector('#Storefront .DigitalVideoWebNodeStorefront_FiltersNav__FiltersNav + div');
    if (div) {
        var observer = new MutationObserver(
            function(mutations) {
                var btn = document.querySelector('#pv-switch');
                if (btn.style.backgroundColor == 'green') {
                    mutations.forEach(
                        function(mutation) {
                            if (mutation.type == 'childList') {
                                window.clearTimeout(pv_timer);
                                pv_timer = window.setTimeout(refreshPvFilter, 1000);
                            }
                        }
                    );
                }
            }
        );
        observer.observe(div,
            {
              attributes: true,
              characterData: true,
              childList: true,
              subtree: true,
              attributeOldValue: true,
              characterDataOldValue: true
            }
        );
    }
}


/**
 * init the script
 *
 */
insertCss();
createPvButton();
// check for updates
checkForUpdates();

// ineable dyn. loading observer or watcher
// initDomObserver();
initWatcher();

// start with filtered view
togglePvOnly();

console.log('Prime-switch started.');