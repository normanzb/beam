/*!require:*/
/*
JQueryPlugin: jQuery.fn.beam

Move an element relatively to another element.

Usage:
    $(eleA).beam().to(eleB).at('left top bottom ... ');

Options:
target - the object of reference for positioning.
*/
;(function(Ctor){
    if ( window.define && window.define.amd != null){
        define(function(){
            return Ctor;
        });
    }
    if ( window.jQuery ) {
        new Ctor(window.jQuery);
    }
})
(function($){
    if ( $ == null ) {
        throw new Error('jQuery is not specified');
    }

    var KEY_DATA = 'jQuery.fn.beam.data';
    var KEY_INSTANCE = 'jQuery.fn.beam.instance';
    var DEF_MODIFIER = 'inner';
    var MODIFIER = {'outer':1, 'inner':2 };
    var POSITION = {'middle':1, 'center':2, 'left':4, 'right':8, 'bottom':16, 'top':32};

    var defaultOptions = {
        target: null,
        animCacheProp: null,
        enableMargin: false
    };
    var viewport;

    var settingsHolder = {};

    function dematerialize(i, dom){
        var el = $(dom),
            settings = {}, 
            offset = null, 
            diff = null, 
            data,
            frameOffset = {}, 
            origPos, 
            origData,
            targetMarginLeft,
            targetMarginTop;

        $.extend(settings, settingsHolder);

        // make sure it is jquery obj
        settings.target = $(settings.target);

        // get original position setting
        origData = el.data(KEY_DATA);
        origPos = origData && origData.position || 
            { 
                position: el[0].style.position, 
                left: el.css('left'), 
                top: el.css('top'), 
                right: el.css('right'),
                bottom: el.css('bottom') 
            };

        el.css('left', el.position().left);
        el.css('top', el.position().top);
        el.css('position', 'absolute');

        targetMarginLeft    = ( parseInt(settings.target.css('marginLeft')) >>> 0 );
        targetMarginTop     = ( parseInt(settings.target.css('marginTop')) >>> 0 );
        targetMarginRight   = ( parseInt(settings.target.css('marginRight')) >>> 0 );
        targetBorderLeft    = ( parseInt(settings.target.css('borderLeftWidth')) >>> 0 );
        targetBorderTop     = ( parseInt(settings.target.css('borderTopWidth')) >>> 0 );
        targetBorderRight   = ( parseInt(settings.target.css('borderRightWidth')) >>> 0 );
        targetBorderBottom   = ( parseInt(settings.target.css('borderBottomWidth')) >>> 0 );

        // we'd better not change the hierachical structure of dom,
        // if el and target don't share same parent,
        // we need to caculate the position diff between them
        if ( el.parent().get(0) == settings.target.parent().get(0) ) {
            offset = settings.target.position();
            // we don't have to consider RTL here, because offset always return left and top
            offset.left += targetMarginLeft;
            offset.top += targetMarginTop;
        }
        else {
            diff = {
                left: settings.target.offset().left -
                    settings.target.position().left -
                    (el.offset().left - el.position().left ),
                top:  settings.target.offset().top -
                    settings.target.position().top - 
                    (el.offset().top - el.position().top )
            };

            offset = settings.target.position();
            offset.top += diff.top;
            offset.left += diff.left;
        }

        frameOffset = getDocumentOffset(el, settings.target);

        offset.top += frameOffset.top;
        offset.left += frameOffset.left;

        data = {
            settings: settings,
            offset: offset,
            position: origPos,
            margin: {
                left: targetMarginLeft,
                right: targetMarginRight,
                top: targetMarginTop
            },
            border: {
                left: targetBorderLeft,
                top: targetBorderTop,
                right: targetBorderRight,
                bottom: targetBorderBottom
            } 
        };

        el.data(KEY_DATA, data);
    }

    /**
     * @function setLeft Set the css('left') by default, but if it is in a rtl element,
     * will calculate corresponding 'right distance' and user css('right') instead of left.
     * @private
     */
    function setLeft(el, left, offset, animOptions, additionalProp){

        var parent = el.offsetParent(),
            data = el.data(KEY_DATA);

        var cssProp = 'left', value = 0;

        // if offsetparent is body and it is a non-positioned element
        // that means the positioning element is <html />
        if (parent[0].tagName.toUpperCase() == 'BODY' &&
            !(/absolute|relative|fixed/i.test(parent.css('position')))){
            parent = $(document.documentElement);
        }


        if (parent.length <= 0 || el.css('direction') != 'ltr'){
            // right to left layout
            var right = parent.outerWidth() - left - el.outerWidth();

            if (offset != null && !isNaN(offset * 1)){
                right -= offset;
            }

            cssProp = 'right';
            value = right;

            if ( data.settings.enableMargin ){
                value += parseInt( el.css('marginRight') );
            }
        }
        else {

            if (offset != null && !isNaN(offset * 1)){
                left += offset;
            }

            // left to right layout (default)
            cssProp = 'left';
            value = left;

            if (data.settings.enableMargin){
                value += parseInt( el.css('marginLeft') );
            }
        }

        setTargetPos(el, cssProp, value, animOptions, additionalProp);
    };

    /**
     * @function setTop Set css('top') and plus offset
     * @private
     */
    function setTop(el, top, offset, animOptions, additionalProp){
        var cssProp = 'left', value = 0,
            data = el.data(KEY_DATA);

        if (offset != null && !isNaN(offset * 1)){
            top += offset;
        }

        cssProp = 'top';
        value = top;

        if (data.settings.enableMargin){
            value += parseInt(el.css('marginTop'));
        }

        setTargetPos(el, cssProp, value, animOptions, additionalProp);
    };

    /**
     * @function setTargetPos
     * set target position or move target to position with animation
     **/
    function setTargetPos(el, cssProp, value, animOptions, additionalProp){
        var animProp = {}, dataOpts;

        if (!animOptions || animOptions === false){
            el.css(cssProp, value);
        }
        else{
            if (animOptions === true){
                animOptions = {};
            }

            // if animCache enabled, it means user wants to do all
            // animation all together.
            if (animOptions.delay === true){
                delete animOptions.delay;
                if (el.data(KEY_DATA).animCacheProp == null){
                    el.data(KEY_DATA).animCacheProp = {};
                }
                dataOpts = el.data(KEY_DATA);
                dataOpts.animCacheProp[cssProp] = value;
                if (additionalProp){
                    $.extend(dataOpts.animCacheProp, additionalProp);
                }

            }
            else{
                // if there are delayed animation
                if (el.data(KEY_DATA).animCacheProp){
                    animProp = el.data(KEY_DATA).animCacheProp;
                    el.data(KEY_DATA).animCacheProp = null;
                }
                animProp[cssProp] = value;
                if (additionalProp){
                    $.extend(animProp, additionalProp);
                }

                el.animate(animProp, animOptions);
            }
        }
    }

    /**
     * @function getDocumentOffset
     *
     */
    function getDocumentOffset(source, target){
        // get target and source element's ownedDocument
        // if they are in different document
        // the result will count in the offset of iframe
        var sourceDoc = source[0].ownerDocument,
            targetDoc = target[0].ownerDocument;


        var frameOffset = {left:0, top:0},
            parentWin, parentDoc, currentWin, elFound = false, tmp;

        if (sourceDoc === targetDoc){
            return frameOffset;
        }

        // check if targetDoc is inside sourceDoc
        // currently we dont support targetDoc is parent doc of sourceDoc

        currentWin = getDocWin(targetDoc);
        parentDoc = getParentDoc(currentWin);

        do{
            parentWin = getDocWin(parentDoc);

            elFound = null;

            // search for iframes
            $(parentDoc).find('iframe').each(function(i, el){
                try{
                    if (el.contentWindow == currentWin){
                        elFound = el;
                        return false;
                    }
                }
                catch(ex){
                    if (window.console){
                        window.console.log('' + ex.message);
                    }
                }
            });

            // associated iframe found?
            if (elFound){
                tmp = $(elFound).offset();
                frameOffset.left += tmp.left;
                frameOffset.top += tmp.top;
            }
            else{
                throw 'target element is not a sub window of current window';
            }

            currentWin = parentWin;
            parentDoc = getParentDoc(parentWin);
        }
        while(parentDoc);

        return frameOffset;
    };

    /**
     * @function getDocWin
     * return the parentWindow of specified document object
     */
    function getDocWin(doc){
        return doc.defaultView? doc.defaultView: doc.parentWindow;
    };

    function getParentDoc(win){

        return (win.parent && win.parent != win)? win.parent.document:null;
    };

    /**
     * Helpers
     **/
    function innerFuncArgumentConcater(funcToCall, args, outerArguments, amongToRemove){
        var outerArgs = Array.prototype.slice.call(outerArguments);

        outerArgs.splice(0,amongToRemove);
        args = args.concat(outerArgs);

        funcToCall.apply(this, args);
    };

    function enableFauxViewPortDiv() {
        if (viewport) {
            viewport.style.display = 'block';
            document.body.appendChild(viewport);
            return viewport;
        }

        viewport = document.createElement('div');
        viewport.style.visibility = 'hidden';
        viewport.style.opacity = '0';
        viewport.style.pointerEvents = 'none';
        viewport.style.position = 'fixed';
        viewport.style.top = '0';
        viewport.style.left = '0';
        viewport.style.right = '0';
        viewport.style.bottom = '0';
        viewport.style.margin = '0';
        viewport.style.padding = '0';

        viewport.style.display = 'block';
        document.body.appendChild(viewport);
        return viewport;
    }

    function disableFauxViewPortDiv() {
        if (viewport == null || viewport.parentNode == null) {
            return;
        }
        viewport.style.display = 'none';
        document.body.removeChild(viewport);
    }

    /**
     * Public methods
     **/
    var methods = {
        to: function(another, options){
            if (options == null){
                options = {};
            }

            if (another === window) {
                options.target = $(enableFauxViewPortDiv());
            }
            // another can be option or jQuery obj or jQuery selector
            else if (Object.prototype.toString.call(another).toLowerCase().indexOf('string') > 0 ||
                another.length != null && another.attr != null){
                
                options.target = another;
            }
            // it could also be a native element
            else if(another.tagName != null && another.tagName != false){

                options.target = $(another);
            }
            else {
                options = another;
            }
            $.extend(settingsHolder, defaultOptions, options);
            return this.each(dematerialize);
        },
        at: function(where){
            var specs = where.split(' '),
                target,
                spec, 
                modifier = DEF_MODIFIER,
                left, top, 
                data;

            for( var i = 0; i < specs.length; i++ ) {
                spec = specs[ i ];

                if ( MODIFIER[spec] ) {
                    modifier = spec;
                }
                else if ( POSITION[spec] ) {
                    // start positioning according to spec
                    data = this.data(KEY_DATA);
                    target = data.settings.target;

                    // something wrong with current element
                    if ( data == null ) {
                        continue;
                    }

                    if ( spec == "left" ) {

                        // default to inner
                        left = data.offset.left;

                        if ( modifier == "outer" ) {
                            left -= this.outerWidth();
                        } 
                        else {
                            left += data.border.left;
                        }
                    }
                    else if ( spec == "right" ) {

                        // default to outer
                        left = data.offset.left + target.outerWidth();

                        if ( modifier == "inner" ) {
                            left -= this.outerWidth() + data.border.right;
                        }
                    }
                    else if ( spec == "top" ) {

                        // default to inner
                        top = data.offset.top;

                        if ( modifier == "outer" ) {
                            top -= this.outerHeight();
                        }
                        else {
                            top += data.border.top;
                        }
                    }
                    else if ( spec == "bottom" ) {

                        // default to outer
                        top = data.offset.top + target.outerHeight();

                        if ( modifier == "inner" ) {
                            top -= this.outerHeight() + data.border.bottom;
                        }
                    }
                    else if ( spec == "center" ) {
                        left = data.offset.left + (target.outerWidth() - this.outerWidth()) / 2;
                    }
                    else if ( spec = "middle" ) {
                        top = data.offset.top + (target.outerHeight() - this.outerHeight()) / 2;
                    }
                    else {
                        throw "code shouldn't reach here.";
                    }

                    if ( left != null ) {
                        innerFuncArgumentConcater(setLeft, [this, left], arguments, 1);
                    }
                    else if ( top != null ) {
                        innerFuncArgumentConcater(setTop, [this, top], arguments, 1);
                    }

                    // clear up
                    modifier = DEF_MODIFIER;
                    left = null;
                    top = null;
                }
                else {
                    // the user is talking gibberish...
                }
            }

            disableFauxViewPortDiv();
        }
    };

    /*
     * Constructor: Transporter
     */
    function Transporter($ref) {
        this.$ = $ref;
    }

    !function(){
        var transporterProto = Transporter.prototype;

        // set up the members of Transporter
        for ( var key in methods ) 
        (function(key) {
            transporterProto[ key ] = function() {
                return methods[ key ].apply( this.$, arguments );
            };
        })(key);
    }();

    /*
     * Constructor: TransporterCollection
     */
    function TransporterCollection($collection){
        this.$ = $collection;

        this.$.each(function(){
            var $el = $(this);
            var instance = new Transporter($el);

            $el.data( KEY_INSTANCE, instance );
        });
    }

    !function(){
        var transporterProto = Transporter.prototype;
        var collectionProto = TransporterCollection.prototype;

        // set up the members of TransporterCollection
        for ( var key in transporterProto ) 
        (function(key) {
            collectionProto[ key ] = function() {
                var args = arguments;

                this.$.each(function(){
                    var $el = $(this);
                    var instance = $el.data( KEY_INSTANCE );
                    instance[ key ].apply( instance, args );
                });

                return this;
            };
        })(key);
    }();

    TransporterCollection.prototype.end = function() {
        return this.$;
    };

    var pluginMethods = {
        beam: function() {
            return new TransporterCollection(this);
        },
        unbeam: function() {
            var data = this.data( KEY_DATA );

            if ( !data || !data.position ) {
                return;
            }

            disableFauxViewPortDiv();

            this.removeData( KEY_INSTANCE );

            // restore original position
            this.css( data.position );

            this.removeData( KEY_DATA );

            return this;
        }
    };

    $.fn.extend(pluginMethods);

});
