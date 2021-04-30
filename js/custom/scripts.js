/*
** CV
** 29 Apr 2021
** Jquery scripts
** Walrus
*/
var epiCollapse = $('#collapse-epitech')

$('#collapse-epitech-target').hide()
epiCollapse.on('click', () => {
    $('#collapse-epitech-target').slideToggle(500);
});
var blocks = $('.blk-list div.blk-spec');
blocks.hide();
var blockExp = $('.blk-list-exp div.blk-spec');
// blockExp.hide();
jQuery.each(blocks, function( key, value ) {
    $("#"+value.id).delay(500*key).fadeIn(1000);
});

$('#tab-formation').on('click', () => {
    jQuery.each(blocks, function( key, value ) {
        $("#"+value.id).delay(500*key).fadeIn(1000);
    });
});

$('#tab-exp').on('click', () => {
    $('#collapse-epitech-target').hide();
    blocks.hide();
    blockExp.hide();
    jQuery.each(blockExp, function( key, value ) {
        $("#"+value.id).delay(500*key).fadeIn(1000);
    });
    
});

$('.linkmy a').on('mouseenter', (event) => {
    event.preventDefault();
    $("#"+event.target.id).animate({backgroundColor: '#006AB3', color: 'white'}, 500);
    $("#"+event.target.id).css('font-weight', 700);
});

$('.linkmy a').on('mouseleave', (event) => {
    event.preventDefault();
    $("#"+event.target.id).animate({backgroundColor: 'transparent', color: '#006AB3'}, 500);
    $("#"+event.target.id).css('font-weight', 400);
});