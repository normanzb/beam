/*!require:*/
/*
JQueryPlugin: jQuery.fn.dropTo

Drop an element relatively to another element.

Usage:
    $(eleA).dropTo(eleB).left()

Options:
target - the object of reference for positioning.
*/
(function($, etui){

    var dataKey = 'jQuery.fn.dropTo.Data';
    var defaultOptions = {
        target: null,
        animCacheProp: null
    };

    var settingsHolder = {};

    function init(i, dom){
        var el = $(dom);

        var settings = {};
        $.extend(settings, settingsHolder);

        // make sure it is jquery obj
        settings.target = $(settings.target);
        var offset = null, frameOffset = {};

        el.css('position', 'absolute');
        // we'd better not change the hierachical structure of dom,
        // if el and target don't share same parent,
        // we need to caculate the position diff between them
        if (el.parent().get(0) == settings.target.parent().get(0) &&
            // temporary fix for jQuery bug 8945
            // http://bugs.jquery.com/ticket/8945
            $.browser.webkit == null)
            offset = settings.target.position();
        else{
            var diff = {
                left: settings.target.offset().left -
                    settings.target.position().left -
                    (el.offset().left - el.position().left),
                top:  settings.target.offset().top -
                    settings.target.position().top -
                    (el.offset().top - el.position().top)
            }
            offset = settings.target.position();
            offset.top += diff.top;
            offset.left += diff.left;

            //el.appendTo(document.body);
        }

        frameOffset = getDocumentOffset(el, settings.target);

        offset.top += frameOffset.top;
        offset.left += frameOffset.left;

        var data = {
            settings: settings,
            offset: offset
        };

        el.data(dataKey, data);
    }

    /**
     * @function setBidiLeft Set the css('left') by default, but if it is in a rtl element,
     * will calculate corresponding 'right distance' and user css('right') instead of left.
     * @private
     */
    function setBidiLeft(el, left, offset, animOptions, additionalProp){

        var parent = el.offsetParent();

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
        }
        else{

            if (offset != null && !isNaN(offset * 1)){
                left += offset;
            }

            // left to right layout (default)
            cssProp = 'left';
            value = left;
        }

        setTargetPos(el, cssProp, value, animOptions, additionalProp);
    };

    /**
     * @function setTop Set css('top') and plus offset
     * @private
     */
    function setTop(el, top, offset, animOptions, additionalProp){
        var cssProp = 'left', value = 0;

        if (offset != null && !isNaN(offset * 1)){
            top += offset;
        }

        cssProp = 'top';
        value = top;

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
            if (animOptions.dtDelay === true){
                delete animOptions.dtDelay;
                if (el.data(dataKey).animCacheProp == null){
                    el.data(dataKey).animCacheProp = {};
                }
                dataOpts = el.data(dataKey);
                dataOpts.animCacheProp[cssProp] = value;
                if (additionalProp){
                    $.extend(dataOpts.animCacheProp, additionalProp);
                }

            }
            else{
                // if there are delayed animation
                if (el.data(dataKey).animCacheProp){
                    animProp = el.data(dataKey).animCacheProp;
                    el.data(dataKey).animCacheProp = null;
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
    /**
     * @function curry Curry helper function, return a function that calls
     * 'func' and pass remaining arguments to 'func'.
     * @private
     */
    function curry(func){
        var args = Array.prototype.slice.apply(arguments);
        args.shift();
        return function(){
            var innerArgs = Array.prototype.slice.apply(arguments);
            innerArgs = innerArgs.concat(args);
            return func.apply(this, innerArgs);
        };
    };

    function callInnerFunc(context, innerFunc, outerArguments){
        var args = [];
        args.push(innerFunc);
        var outerArgs = Array.prototype.slice.call(outerArguments);
        args = args.concat(outerArgs);
        return context.each(curry.apply(context, args));
    };

    function innerFuncArgumentConcater(funcToCall, args, outerArguments, amongToRemove){
        var outerArgs = Array.prototype.slice.call(outerArguments);

        outerArgs.splice(0,amongToRemove);
        args = args.concat(outerArgs);

        funcToCall.apply(this, args);
    };

    /**
     * Targetting Methods
     **/
    function left(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var left = data.offset.left - el.outerWidth();

        innerFuncArgumentConcater(setBidiLeft, [el, left], arguments, 2);
    };

    function top(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var top = data.offset.top - el.outerHeight();

        innerFuncArgumentConcater(setTop, [el, top], arguments, 2);
    };

    function right(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + target.outerWidth();

        innerFuncArgumentConcater(setBidiLeft, [el, left], arguments, 2);
    }

    function bottom(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + target.outerHeight();
        innerFuncArgumentConcater(setTop, [el, top], arguments, 2);
    }

    function insideTop(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top;

        innerFuncArgumentConcater(setTop, [el, top], arguments, 2);
    }

    function insideLeft(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left;

        innerFuncArgumentConcater(setBidiLeft, [el, left], arguments, 2);
    }

    function insideRight(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + target.outerWidth() - el.outerWidth();

        innerFuncArgumentConcater(setBidiLeft, [el, left], arguments, 2);
    }

    function insideBottom(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + target.outerHeight() - el.outerHeight();

        innerFuncArgumentConcater(setTop, [el, top], arguments, 2);
    }

    function center(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + (target.outerWidth() - el.outerWidth()) / 2;

        innerFuncArgumentConcater(setBidiLeft, [el, left], arguments, 2);
    }

    function middle(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + (target.outerHeight() - el.outerHeight()) / 2;

        innerFuncArgumentConcater(setTop, [el, top], arguments, 2);
    }

    var exports = {
        dropTo: function(another, options){
            if (options == null){
                options = {};
            }

            // another can be option or jQuery obj or jQuery selector
            if (Object.prototype.toString.call(another).toLowerCase().indexOf('string') > 0 ||
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
            return this.each(init);
        },
        /*
         * @function outerLeft, outerTop, outerRight, outerBottom...
         * @param offset
         * @param animationOptions
         */
        outerLeft: function(){
            return callInnerFunc(this, left, arguments);
        },
        outerTop: function(){
            return callInnerFunc(this, top, arguments);
        },
        outerRight: function(){
            return callInnerFunc(this, right, arguments);
        },
        outerBottom: function(){
            return callInnerFunc(this, bottom, arguments);
        },
        innerLeft: function(){
            return callInnerFunc(this, insideLeft, arguments);
        },
        innerTop: function(){
            return callInnerFunc(this, insideTop, arguments);
        },
        innerRight: function(){
            return callInnerFunc(this, insideRight, arguments);
        },
        innerBottom: function(){
            return callInnerFunc(this, insideBottom, arguments);
        },
        atCenter: function(){
            return callInnerFunc(this, center, arguments);
        },
        atMiddle: function(){
            return callInnerFunc(this, middle, arguments);
        }
    };

    $.fn.extend(exports);

    // add etui support
    if (etui && etui.$ && !(etui.$.fn.dropTo)){
        etui.$.extend(exports);
    }

})(window.jQuery, window.etui);
