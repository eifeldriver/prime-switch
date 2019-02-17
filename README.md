# prime-switch
Custom Javascript to add some features to the Amazon Video website.

# Features
* add Button to show all or only Prime included thumbnails

# Requirements
You have to install a browser addon to add custom script to any website.

I recommend Tampermonkey:
* [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Tampermonkey for Opera](https://addons.opera.com/de/extensions/details/tampermonkey-beta/)
* [Tampermonkey for Firefox](https://addons.mozilla.org/de/firefox/addon/tampermonkey/)

# Get started
In this tutorial I use "TM" as shortcut for the word "Tampermonkey".

1. **Install the addon**
Click on the link above and install TM to your favorit browser. After that you see the TM-Icon right top.

2. **Add a new script**
Right-click on that new icon in your browser and click on "Create a new script".
![pic 1](https://c1.staticflickr.com/8/7844/46390822204_603ee56e06.jpg)

3. **Copy source code**
All the script logic is placed in one single file. Your find it here in this repository.
You have to copy the raw source code and put it into the new created script inside TM.
[open the RAW view of the source code](https://raw.githubusercontent.com/eifeldriver/prime-switch/master/prime-switch.js)

4. **Save and test it**
Save the copied code inside TM with the shortcut CTRL+S or via TM-menu "File - Save to disk".
Now call the Amazon Prime website to see if you see the filter button.
![pic 2](https://github.com/eifeldriver/prime-switch/blob/master/preview_filter_button.jpg?raw=true)

[open Amazon Prime page to test](https://www.amazon.de/Amazon-Video/b?ie=UTF8&node=3010075031 )

# Final

Now, after any reload of DIM page, the script will be execute automatically.
