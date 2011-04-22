dropTo

A simple plugin for jQuery, helps you to drop element relatively to 
another element.

## Usage ##

Drop element A to the left side of element B

`$(A).dropTo(b).outerLeft()`

## API Reference ##

`dropTo(<jQuery Object>el)` Specify the relative element.

`outerLeft(<Number>offset)` Drop element to the left side of the relative element.

    `offset` Horizontal offset, positive number 
    to move right.

`outerRight(<Number>offset)` Drop element to the right side of the relative element.

    `offset` Horizontal offset, positive number 
    to move right.

`outerTop(<Number>offset)` Drop element to the top of the relative element.

    `offset` Vertical offset, positive number 
    to move bottom.

`outerBottom(<Number>offset)` Drop element to the bottom of the relative element.

    `offset` Vertical offset, positive number 
    to move bottom.

`innerLeft(<Number>offset)` Drop element to be aligned to the left edge 
of the relative element.

    `offset` Horizontal offset, positive number 
    to move right.

`innerRight(<Number>offset)` Drop element to be aligned to the right edge 
of the relative element.

    `offset` Horizontal offset, positive number 
    to move right.

`innerTop(<Number>offset)` Drop element to be aligned to the top edge 
of the relative element.

    `offset` Vertical offset, positive number 
    to move bottom.

`innerBottom(<Number>offset)` Drop element to be aligned to the bottom edge 
of the relative element.

    `offset` Vertical offset, positive number 
    to move bottom.

`atMiddle(<Number>offset)` Vertically drop element to the middle of the relative
element.

    `offset` Vertical offset, positive number 
    to move bottom.

`atCenter(<Number>offset)` Horizontal drop element to the center of the relative
element.

    `offset` Horizontal offset, positive number 
    to move right.

## TODO ##

`include(<jQuery Object>el)` include an element's rectangle area into 
calculation.

`exclude(<jQuery Object>el)` exclude an element's rectangle area from 
calculation.

## Known Issue ##

1. Positioning goes wrong when <html /> or <body /> has border width, this is due to the differnt returning value of offsetLeft/Top when there are border, even jQuery ignores the width of border in position().
