import set_text_size from './set-text-size'

var div = document.querySelector('div');
window.div = div;

div.style.fontSize = set_text_size(div, window.innerWidth, window.innerHeight).fontSize + "px";
