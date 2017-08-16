/*UDXS Small Sprite Image
----Description----
This script converts an RGBA image into an approximated SSI image
This can later be converted into a palleted 8/4/2/1-bit SSI image.
----Format----
12-Bit Color + 4-bit Transparency
4096 Colors and 16 Transparency levels
Stored as RRRR GGGG BBBB AAAA*/

//Converts a SSI color to RGBA
function cToRgba(c){
    var o = [];
    //We take each component out by using bit masking and then shifting them to the correct length of 4 bits,
    //then, we divide to get a percentage as a float and then multiplying it to get it out of the 0-255 range.
    //Finally, we round it to get a whole number
    o[0] = Math.round((c&0xF000>>12)/15*255);
    o[1] = Math.round((c&0xF00>>8)/15*255);
    o[2] = Math.round((c&0xF0>>4)/15*255);
    o[3] = Math.round((c&0xF)/15* 255);
    return o;
};

//Finds the approximate SSI color from RGBA
function rgbaToC (c){
    var o = 0;
    //First approximate the 4-bit color channel from the 8-bit one,
    //then shift it to the correct position and mix it with the previous outputs
    o = o|(Math.round(c[0]/255*15)<<12);
    o = o|(Math.round(c[1]/255*15)<<8);
    o = o|(Math.round(c[2]/255*15)<<4);
    o = o|Math.round(c[3]/255*15);
    return o;
  }