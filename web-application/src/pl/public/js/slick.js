$(document).ready(() => {
    $('#slideshow .slick').slick({
        slide: 'li',
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: '<i class="icon 	fa fa-angle-right fa-5x nextArrowBtn"></i>',
        prevArrow: '<i class="icon fa fa-angle-left fa-5x prevArrowBtn"></i>',
        responsive: [
            {
                breakpoint: 1800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 915,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    })
})

