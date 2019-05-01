(function () {
  'use strict';
  let windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  // Navbar stick event
  $(document).on("scroll", function () {
    if ($(document).scrollTop() > 100) {
      $("#main-header").addClass("shrink");
    } else if (!($(".navbar-collapse").hasClass('show'))) {
      $("#main-header").removeClass("shrink");

    }

  });

  // toggles .stick on medium devices when navbar expanded
  $(".navbar-toggler").click(function () {
    if ($(document).scrollTop() < 100) {
      $("#main-header").toggleClass('shrink');
    }
  })

  //close navbar on mobile when clicked
  $('.navbar-nav>li>a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  //home index animation on scroll
  const areaToGetScrolled = windowWidth > 576 ? 300 : 650;
  $(document).on("scroll", function () {
    if ($(document).scrollTop() > areaToGetScrolled) {
      $("#home").addClass("scrolled");
      $("#banner").addClass("scrolled");
    } else {
      $("#banner").removeClass("scrolled");
      $("#home").removeClass("scrolled");
    }
  });

  // Works Carousel
  const owlWorkWith = $(".work-with .owl-carousel");
  owlWorkWith.children().each(function (index) {
      $(this).attr("data-position", index)
    }), owlWorkWith.owlCarousel({
      loop: false,
      margin: 0,
      items: 3,
      mouseDrag: false,
      autoplay: false,
      center: true,
      dots: false,
      nav: true,
      navText: ["<i class='owl-nav fa fa-arrow-left'>", "<i class='owl-nav fa fa-arrow-right'>"],
      slideBy: "page",
      dragEndSpeed: 700,
      smartSpeed: 1e3,
      startPosition: 1,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 3
        }
      }
    }),

    $(document).on("click", ".work-with .owl-item>div", function () {
      owlWorkWith.trigger("to.owl.carousel", $(this).data("position"))
    }), owlWorkWith.trigger("refresh.owl.carousel");


  // some works carousel

  // Works Carousel
  const owlWorksList = $(".works-list .owl-carousel");
  owlWorksList.children().each(function (index) {
    $(this).attr("data-position", index)
  }), owlWorksList.owlCarousel({
    loop: false,
    items: 3,
    mouseDrag: false,
    autoplay: false,
    center: true,
    dots: true,
    nav: false,
    slideBy: "page",
    dragEndSpeed: 700,
    smartSpeed: 1e3,
    startPosition: 2,
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      600: {
        items: 1,
        margin: 20
      },
      1210: {
        items: 2,
      },

      1700: {
        items: 3,
        margin: 100
      },

      1900: {
        items: 3,
        margin: 200
      },

      2300: {
        items: 4,
        margin: 400
      },

      2500: {
        items: 4,
        margin: 600
      }
    }
  });
  $(document).on("click", ".works-list .owl-item>div", function () {
    owlWorksList.trigger("to.owl.carousel", $(this).data("position"))
  }), owlWorksList.trigger("refresh.owl.carousel");

  // testimonial carousel
  const owlTestimonals = $(".testimonial__slider .owl-carousel");
  owlTestimonals.owlCarousel({
    loop: false,
    margin: 0,
    items: 1,
    mouseDrag: false,
    autoplay: false,
    center: true,
    dots: false,
    nav: true,
    navContainer: '.testimonial__arrows',
    navText: ["<i class='owl-nav fa fa-arrow-left'>", "<i class='owl-nav fa fa-arrow-right'>"],
    slideBy: "page",
    dragEndSpeed: 700,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    smartSpeed: 1e3,
    startPosition: 2
  });

  // projeto carousel
  const owlProjeto = $(".projeto-images .owl-carousel");
  owlProjeto.owlCarousel({
    loop: false,
    mouseDrag: true,
    autoplay: true,
    center: true,
    dots: true,
    smartSpeed: 1e3,
    startPosition: 2,
    responsive: {
      0: {
        items: 1,
        margin: 0
      },

      928: {
        items: 2,
        margin: 50,
      },

      1668: {
        items: 3,
      }
    }
  });

  // owl carrousel end //

  // wow non mobile init
  new WOW({
    boxClass: 'wowNonMobile',
    mobile: false,
  }).init();

  //normal wow init
  new WOW().init();


  // Smooth Scroll
  $(document).ready(function () {
    $("a").on('click', function (event) {
      if (this.hash !== "" && $(`a[href="${this.hash}"`).attr('href')[0] === '#') {
        event.preventDefault();

        const offset = this.hash == '#speak-us' ? 5 : 30;
        var hash = this.hash;
        $('html, body').animate({
          scrollTop: $(hash).offset().top - offset
        }, 800, function () {});

      }
    });

    setTimeout(() => {
      if (window.location.hash) {
        $(`a[href="${window.location.hash}"`).click();
      }

    }, 1000);
  });

  //starting lazy load
  $('img.lazy').lazyload();

})();