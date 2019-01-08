// pv shortcut means "prime video"

var pv_timer = null;

/* 
 * hide all thumbnails
 * 
 */
function disableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll('.DigitalVideoWebNodeStorefront_Card__CardWrapper');
    for(var idx=0;idx<pv_thumbs.length;idx++) {
        pv_thumbs[idx].style.display = 'none';
    }
}

/* 
 * show all thumbnails
 * 
 */
function enableAllPvThumbs() {
    var pv_thumbs = document.querySelectorAll('.DigitalVideoWebNodeStorefront_Card__CardWrapper');
    for(var idx=0;idx<pv_thumbs.length;idx++) {
        pv_thumbs[idx].style.display = 'inline-block';
    }
}

/* 
 * enable only thumbnails on Prime included items
 * 
 */
function enableOnlyPvThumbs() {
    var pv_thumbs = document.querySelectorAll('.DigitalVideoWebNodeStorefront_Card__CardWrapper .DigitalVideoUI_Logo__primeSash');
    for (var idx=0;idx<pv_thumbs.length;idx++) {
        pv_thumbs[idx].closest('.DigitalVideoWebNodeStorefront_Card__CardWrapper').style.display = 'inline-block';
    }
}

/* 
 * toggle filter on / off
 * 
 */
function togglePvOnly() {
    var btn = document.querySelector('#Subnav #pv-switch');
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

/* 
 * add filter button to top navigation
 * 
 */
function createPvButton() {
    var ul = document.querySelector('#Subnav ul');
    var li = document.createElement('LI');
    li.innerHTML = '<button id="pv-switch">Prime only</button>';
    ul.appendChild(li);
    li.addEventListener('click', togglePvOnly);
    // start with filtered view
    togglePvOnly();
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


/* 
 * init the script
 * 
 */
createPvButton();
initDomObserver();