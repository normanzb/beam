/*!require:*/
/*
JQueryPlugin: jQuery.fn.dropTo

Drop an element relatively to another element.

Usage:
    $(eleA).dropTo(eleB).left()

Options:
target - the object of reference for positioning.
*/
(function($){

    var dataKey = 'jQuery.fn.dropTo.Data';
    var defaultOptions = {
        target: null
    };

    var settingsHolder = {};

    function init(i, dom){
        var el = $(dom);

        var settings = {};
        $.extend(settings, settingsHolder);

        // make sure it is jquery obj
        settings.target = $(settings.target);
        var offset = null;

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
    function setBidiLeft(el, left, offset, animOptions){

        var parent = el.offsetParent();

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

            el.css('right', right);
        }
        else{

            if (offset != null && !isNaN(offset * 1)){
                left += offset;
            }

            // left to right layout (default)
            el.css('left', left);
        }
    };

    /**
     * @function setTop Set css('top') and plus offset
     * @private
     */
    function setTop(el, top, offset, animOptions){
        if (offset != null && !isNaN(offset * 1)){
            top += offset;
        }

        if (!animOptions){
            el.css('top', top);
        }
        else{
            if (animOptions === true){
                animOptions = {};
            }
            el.animate({
                top: top
            }, animOptions);
        }
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
        args.concat(outerArguments);
        return context.each(curry.apply(this, args));
    };

    function innerFuncArgumentConcater(funcToCall, args, outerArguments, amongToRemove){
        var outerArgs = Array.prototype.slice.call(outerArguments);

        outerArgs.splice(0,amongToRemove);
        args.concat(outerArgs);

        funcToCall.apply(this, args);
    };

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

    $.fn.extend({
        dropTo: function(another, options){
            another = $(another);
            // another can be option or jQuery obj
            if (another.length != null && another.attr != null){
                if (options == null){
                    options = {};
                }
                options.target = another;
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
    });

})(jQuery);
