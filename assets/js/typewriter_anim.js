// set up text to print, each item in array is new line
var name_text = new Array(
    "Sagit Bolat"
    );
{
var iSpeed = 100; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = name_text[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines
    
var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

var destination; // element that the text gets written to.

function typewriter_name()
{
    sContents =  ' ';
    iRow = Math.max(0, iIndex-iScrollAt);
    destination = document.getElementById("typedtext-name");
    
    while ( iRow < iIndex ) {
        sContents += name_text[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + name_text[iIndex].substring(0, iTextPos);
    if ( iTextPos++ == iArrLength ) {
        iTextPos = 0;
        iIndex++;
    if ( iIndex != name_text.length ) {
        iArrLength = name_text[iIndex].length;
        setTimeout("typewriter_name()", 500);
    }
    } else {
        // NOTE: This makes the speed of typing slightly random each time.
        var rand_speed = iSpeed + (Math.random() * 400);
        setTimeout("typewriter_name()", rand_speed);
    }
}
}
setTimeout(typewriter_name, 250);