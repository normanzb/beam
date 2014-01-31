#Drop

Position element with respect to another element.

## Usage ##

Drop element A to the left side of element B

`$(A).drop().to(B).at("outer left and middle")`

## API Reference ##

###to

`to(<jQuery Object>el)` Specify the targetting element, source element will be dropped to a position with respect to the target element.

###at

`at(<String>location, <Number>offset, <jQueryAnimationOption|true> option, <additionaljQueryAnimationProp> additionalProp`) Specify the location of current element (against targetting element).

    `location` could be: (vertical) middle, (horizontal) center, left, right, top, bottom, outer left, outer right, outer top...

    `offset` Offset

    `option` can be the `jQuery Animation Option` or just `true`,
     if specified, dropTo will invoke jQuery.fn.animate internally to
     move target to position with animation.

     set `option.dtDelay = true` will delay current animation and do it
     later with the other animations.

     `additionalProp` additional custom animation properties

## Known Issue ##

1. Positioning goes wrong when `<html />` or `<body />` has border width, this is due to the differnt returning value of offsetLeft/Top when there are border, even jQuery ignores the width of border in position().
