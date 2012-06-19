Minecraft HTML Widgets
======================

Minecraft widgets that can be used within HTML pages. The only widget thus far
is the player skin widget.

Usage
-----

No setup/install required, just insert this iframe in any HTML page:

    <iframe
      src="http://marcuswhybrow.github.com/minecraft-widgets/skin.html?playername=PLAYERNAME&scale=SCALE"
      width="WIDTH"
      height="HEIGHT"
      frameborder="0"
      scrolling="0"
      allowtransparency="true">
    </iframe>

Where the block capitals are replaced with:

    PLAYERNAME : The case sensitive Minecraft player name
    
    SCALE      : A value of 1, creates a 32px tall figure, the scale multiples this
                 value, meaning a value of 10 would create a 320px tall figure
                 
    WIDTH      : Must be set to the result of SCALE * 16
    HEIGHT     : Must be set to the result of SCALE * 32

Defaults
--------

If the `playername` argument is not passed to the `skin.html` page the default (Steve) skin is used instead. The default skin is also used if the player name cannot be found. The `scale` argument likewise defaults to a value, which is 1. (Note, you still have to set the iframe width and height manually.)

Limitations
-----------

* Players names are case-sensitive.
* Scale can be any integer, greater than zero.
* Although scale may currently be infinitely larege, it is recommended not go over 100. The scaling alorithm is fairly efficient, but can run into slow downs at those crazy sized. P.S. The scaling work is done in JavaScript so its your computer and your visitors which will be scaling the image!

Browser Compatibility
---------------------

Should work on all [browsers which support the `canvas` tag][canvas-support]:

* Internet Explorer: 9.0 +
* Firefox: 2.0 +
* Safari: 3.1 + (3.2 + for mobile)
* Chrome: 4.0 + (2.1 + for Android Browser)
* Opera: 9.0 + (10.0 for mobile)

[canvas-support]: http://en.wikipedia.org/wiki/Canvas_element#Support