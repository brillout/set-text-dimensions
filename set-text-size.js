
var hide_flickering = (function(){
    var opacity_saved;
    return {
        activate: function(element){
            opacity_saved = get_computed_style(element, 'opacity');
            element.style.opacity = 0;
        },
        deactivate: function(element){
            element.style.opacity = opacity_saved;
        }
    }
})();

export default function(element, width_target, height_target){

    element = generate_hidden_clone(element);

    hide_flickering.activate(element);

    window.el = element;
    estimate(element, width_target, height_target);

    refine(element, width_target, height_target);

    hide_flickering.deactivate(element);

    var current = get_computed_size(element);
    current.ratio = current.height / current.width;

    //element.parentNode.removeChild(element);

    return current;

};

function generate_hidden_clone(element) {
    var clone = deep_clone(element)

    clone.style.fontSize = '40px';

    clone.style.display='inline-block';

    clone.style.position='absolute';
    clone.style.top='0';
    clone.style.left='0';
    clone.style.top='-9999px';
    clone.style.zIndex='-9999';
    clone.style.visibility='hidden';

    element.parentNode.appendChild(clone);

    return clone;

    function deep_clone(el){
        if( !el.tagName )
            return document.createTextNode(el.textContent);

        var node = document.createElement(el.tagName);

        /*
        var computed_style = document.defaultView.getComputedStyle(el,null);
        for(var prop in computed_style) {
            if( ['width','height'].indexOf(prop) === -1 )
                node.style[prop] = computed_style.getPropertyValue(prop);
        }
        */
        node.style.cssText = el.style.cssText;

        for(var i=0;i<el.childNodes.length;i++) {
            node.appendChild(deep_clone(el.childNodes[i]));
        }

        return node;
    }

}

function estimate(element, width_target, height_target) {
    // Assume that element's size scales with increasing/decreasing font size
    // I.e. width / fontSize = `a constant value for every font size`, same for height
    // This assumption is not true but a good approximation

    var current = get_computed_size(element);

    set_fontSize(
        element,
        current.fontSize * Math.min(width_target/current.width, height_target/current.height)
    );
}

function refine(element, width_target, height_target) {
    var max_iter = 1000;
    var too_big = false;
    var previous;
    var number_of_no_resize = 0;
    while( max_iter-- ) {
        previous = current;
        var current = get_computed_size(element);
        number_of_no_resize =
            previous && previous.width === current.width && previous.height === current.height ?
                number_of_no_resize + 1 :
                0;
        if( number_of_no_resize === 10 ) {
            dev_warning('incrementing/decrementing font-size does not change size of element');
            return;
        }
        if( current.width > width_target || current.height > height_target ) {
            too_big = true
        }
        else if (too_big === true ) {
            return;
        }
        set_fontSize(
            element,
            current.fontSize + (too_big?-1:1)*(Math.ceil(current.fontSize/50))
        );
    }
    dev_warning('maximum number of iterations has been reached to compute font size');
}

function set_fontSize(element, fontSize) {
    element.style.fontSize = fontSize + 'px';
}
function get_computed_size(element) {
    function get_computed_style_int(element, prop){
        return parseInt(get_computed_style(element, prop),10);
    }
    return {
        width: get_computed_style_int(element, 'width'),
        height: get_computed_style_int(element, 'height'),
        fontSize: get_computed_style_int(element, 'font-size')
    };
}
function get_computed_style(element, prop){
    return document.defaultView.getComputedStyle(element,null).getPropertyValue(prop);
}

function dev_warning(msg) {
    console&&console.log&&console.log('set-text-dimensions.js: warning: '+msg);
}
