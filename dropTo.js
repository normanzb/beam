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
        if (el.parent().get(0) == settings.target.parent().get(0))
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
    function setBidiLeft(el, left, offset){
    
        var parent = el.offsetParent();
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
    function setTop(el, top, offset){
        if (offset != null && !isNaN(offset * 1)){
            top += offset;
        }
        el.css('top', top);
    };
    
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

    function left(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var left = data.offset.left - el.outerWidth();
        setBidiLeft(el, left, offset);
    };

    function top(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var top = data.offset.top - el.outerHeight();
        
        setTop(el, top, offset);
    };

    function right(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + target.outerWidth();
        setBidiLeft(el, left, offset);
    }

    function bottom(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + target.outerHeight();
        
        setTop(el, top, offset);
    }

    function insideTop(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top;
        
        setTop(el, top, offset);
    }

    function insideLeft(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left;
        setBidiLeft(el, left, offset);
    }
    
    function insideRight(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + target.outerWidth() - el.outerWidth();
        setBidiLeft(el, left, offset);
    }

    function insideBottom(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + target.outerHeight() - el.outerHeight();
        
        setTop(el, top, offset);
    }

    function center(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var left = data.offset.left + (target.outerWidth() - el.outerWidth()) / 2;
        setBidiLeft(el, left, offset);
    }

    function middle(i, dom, offset){
        var el = $(dom);
        var data = el.data(dataKey);
        if (data == null) return;
        var target = data.settings.target;
        var top = data.offset.top + (target.outerHeight() - el.outerHeight()) / 2;
        
        setTop(el, top, offset);
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
        outerLeft: function(offset){
            return this.each(curry(left, offset));
        },
        outerTop: function(offset){
            return this.each(curry(top, offset));
        },
        outerRight: function(offset){
            return this.each(curry(right, offset));
        },
        outerBottom: function(offset){
            return this.each(curry(bottom, offset));
        },
        innerLeft: function(offset){
            return this.each(curry(insideLeft, offset));
        },
        innerTop: function(offset){
            return this.each(curry(insideTop, offset));
        },
        innerRight: function(offset){
            return this.each(curry(insideRight, offset));
        },
        innerBottom: function(offset){
            return this.each(curry(insideBottom, offset));
        },
        atCenter: function(offset){
            return this.each(curry(center, offset));
        },
        atMiddle: function(offset){
            return this.each(curry(middle, offset));
        }
    });

})(jQuery);
