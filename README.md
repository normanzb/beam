dropTo

A simple plugin for jQuery, helps you to drop element relatively to
another element.

## Usage ##

Drop element A to the left side of element B

`$(A).dropTo(b).outerLeft()`

## API Reference ##

`dropTo(<jQuery Object>el)` Specify the relative element.

`outerLeft(<Number>offset, <jQueryAnimationOption|true> option), <additionaljQueryAnimationProp> additionalProp` Drop element to the left side of the relative element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` can be the `jQuery Animation Option` or just `true`,
     if specified, dropTo will invoke jQuery.fn.animate internally to
     move target to position with animation.

     set `option.dtDelay = true` will delay current animation and do it
     later with the other animations.

     `additionalProp` additional custom animation properties


`outerRight(<Number>offset)` Drop element to the right side of the relative element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`outerTop(<Number>offset)` Drop element to the top of the relative element.

    `offset` Vertical offset, positive number
    to move bottom.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`outerBottom(<Number>offset)` Drop element to the bottom of the relative element.

    `offset` Vertical offset, positive number
    to move bottom.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`innerLeft(<Number>offset)` Drop element to be aligned to the left edge
of the relative element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`innerRight(<Number>offset)` Drop element to be aligned to the right edge
of the relative element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`innerTop(<Number>offset)` Drop element to be aligned to the top edge
of the relative element.

    `offset` Vertical offset, positive number
    to move bottom.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`innerBottom(<Number>offset)` Drop element to be aligned to the bottom edge
of the relative element.

    `offset` Vertical offset, positive number
    to move bottom.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`atMiddle(<Number>offset)` Vertically drop element to the middle of the relative
element.

    `offset` Vertical offset, positive number
    to move bottom.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

`atCenter(<Number>offset)` Horizontal drop element to the center of the relative
element.

    `offset` Horizontal offset, positive number
    to move right.

    `option` same as the one in `outerLeft()`

    `additionalProp` same as the one in `outerLeft()`

## TODO ##

`include(<jQuery Object>el)` include an element's rectangle area into
calculation.

`exclude(<jQuery Object>el)` exclude an element's rectangle area from
calculation.

Animation Supports

## Known Issue ##

1. Positioning goes wrong when `<html />` or `<body />` has border width, this is due to the differnt returning value of offsetLeft/Top when there are border, even jQuery ignores the width of border in position().
