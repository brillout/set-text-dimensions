For a given `dom_element_with_text`, `width` and `height`, this library computes the maximum `dom_element_with_text.style.fontSize` for which the width and height of `dom_element_with_text` are smaller than `width` and `height`.

In other words, if you want a text to fit within a container while the fontSize being maximized, then this library is for you.


### Usage

```
<span id='text'>make_me_big</span>
<script src='http://brillout.github.io/set-text-dimensions/index.js'></script>
<script>
    var dom_element_with_text = document.getElementById('text');

    var computation =
        set_text_dimensions(
            dom_element_with_text, // text element
            400, // maximum width
            100); // maximum height

    computation.fontSize; // computed fontSize such that
                          // fontSize is max while `width<=400 && height<=100`

    dom_element_with_text.style.fontSize = computation.fontSize + 'px';
</script>
```

This code on <a href='http://jsfiddle.net/brillout/yjtqegz9/1/'>JSFiddle</a>


### Live Demo

A more interesting demo on <a href='http://brillout.github.io/set-text-dimensions/'>brillout.github.io/set-text-dimensions</a>


### Used By

<a href='http://www.timer-tab.com'>timer-tab.com</a>

<a href='http://msgtab.brillout.com'>msgtab.brillout.com</a>

<a href='http://www.clocktab.com'>clocktab.com</a>
