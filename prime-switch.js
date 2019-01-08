// pv shortcut means "prime video"
var version     = '0.3';
var version_file= 'https://raw.githubusercontent.com/eifeldriver/prime-switch/master/version';
var pv_timer    = null;
var selector1   = '.DigitalVideoWebNodeStorefront_Card__CardWrapper';
var selector2   = '';


/*
 * insert custom CSS
 *
 */ 
function insertCss() {
    var css     =   '#prime-switch-update { position: absolute; top: 0; right:0; transform: translate(50%, -50%);  }' + 
                    ' #prime-switch-update span { line-height: 20px; width: 75px; border-radius: 50%; padding: 0; font-size: 0px; padding: 4px; border: 1px solid lightgreen; background: red; }';
    var style   = document.createElement('STYLE');
    style.innerHTML = css; 
    document.querySelector('head').appendChild(style);
}
 
/* 
 * hide all thumbnails
 * 
 */
function disableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector1);
    if (pv_thumbs) {
        for(var idx=0;idx<pv_thumbs.length;idx++) {
            pv_thumbs[idx].style.display = 'none';
        }
    }
}

/* 
 * show all thumbnails
 * 
 */
function enableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector1);
    if (pv_thumbs) {
        for(var idx=0;idx<pv_thumbs.length;idx++) {
            pv_thumbs[idx].style.display = 'inline-block';
        }
    }
}

/* 
 * enable only thumbnails on Prime included items
 * 
 */
function enableOnlyPvThumbs() {
    var pv_thumbs = document.querySelectorAll(selector1 + ' .DigitalVideoUI_Logo__primeSash, ' + selector1 + ' .DigitalVideoWebNodeStorefront_Card__primeBadge');
    if (pv_thumbs) {
        for (var idx=0;idx<pv_thumbs.length;idx++) {
            pv_thumbs[idx].closest(selector1).style.display = 'inline-block';
        }
    }
}

/* 
 * toggle filter on / off
 * 
 */
function togglePvOnly() {
    var btn = document.querySelector('#Subnav #pv-switch');
    if (btn) {
        if (btn.style.backgroundColor == 'green') {
            // show all thumbs
            enableAllPvThumbs();
            btn.style.backgroundColor = 'inherit';
            btn.style.color = 'inherit';
            
        } else {
            // show only Prime Thumbs
            disableAllPvThumbs();
            enableOnlyPvThumbs();
            btn.style.backgroundColor = 'green';
            btn.style.color = 'white';
        }
    }
}

function checkForUpdates() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', version_file);
    xhr.onload = function() {
        if (xhr.status === 200) { 
            var repo_version = xhr.responseText;
            if (version.trim() != repo_version.trim()) {
                // other version available
                var css = '';
                var info = document.createElement('DIV');
                info.id = 'prime-switch-update';
                info.style = 
                info.innerHTML = '<span title="Your version = ' + version + ' | New version = ' + repo_version + '">*</span>';
                var btn = document.querySelector('#pv-switch');
                btn.appendChild(info);
            } 
        } else {
            return null
        }
    };
    xhr.send();
}

/* 
 * add filter button to top navigation
 * 
 */
function createPvButton() {
    var ul = document.querySelector('#Subnav ul');
    if (ul) {
        var li = document.createElement('LI');
        li.innerHTML = '<button id="pv-switch">Prime only</button>';
        ul.appendChild(li);
        li.addEventListener('click', togglePvOnly);
        // start with filtered view
        togglePvOnly();
    }
    checkForUpdates();
}

/* 
 * update filtered view
 * 
 */
function refreshPvFilter() {
    // update view after scrolling and dynamic loads
    disableAllPvThumbs();
    enableOnlyPvThumbs();
}

/* 
 * watch for new loaded items after scrolling
 * 
 */
function initDomObserver() {
    var div = document.querySelector('#Storefront .DigitalVideoWebNodeStorefront_FiltersNav__FiltersNav + div');
    if (div) {
        var observer = new MutationObserver(
            function(mutations) {
                var btn = document.querySelector('#Subnav #pv-switch');
                if (btn.style.backgroundColor == 'green') {
                    mutations.forEach(
                        function(mutation) {
                            if (mutation.type == 'childList') {
                                window.clearTimeout(pv_timer);
                                pv_timer = window.setTimeout(refreshPvFilter, 500);
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


/* 
 * init the script
 * 
 */
insertCss();
createPvButton();
initDomObserver();
