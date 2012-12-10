dropTo

Position element with respect to another element.

## Usage ##

Drop element A to the left side of element B

`$(A).dropTo(b).outerLeft()`

## API Reference ##

###Targetting API:###

`dropTo(<jQuery Object>el)` Specify the targetting element, source element will be dropped to a position with respect to the target element.

###Dropping API###

Drop API usage:

`[---dropAPI---](<Number>offset, <jQueryAnimationOption|true> option, <additionaljQueryAnimationProp> additionalProp`) Drop element to the left side of the relative element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` can be the `jQuery Animation Option` or just `true`,
     if specified, dropTo will invoke jQuery.fn.animate internally to
     move target to position with animation.

     set `option.dtDelay = true` will delay current animation and do it
     later with the other animations.

     `additionalProp` additional custom animation properties

Drop API list:

outerLeft

outerRight

outerTop

outerBottom

innerLeft

innerRight

innerTop

innerBottom

atMiddle

atCenter

## TODO ##

`include(<jQuery Object>el)` include an element's rectangle area into
calculation.

`exclude(<jQuery Object>el)` exclude an element's rectangle area from
calculation.

Animation Supports

## Known Issue ##

1. Positioning goes wrong when `<html />` or `<body />` has border width, this is due to the differnt returning value of offsetLeft/Top when there are border, even jQuery ignores the width of border in position().
