 //Set nav-link active while scrolling
    // Cache selectors
    mainNav = $("#main-nav"),
      mainNavHeight = mainNav.outerHeight() + 15,
      // All list items
      menuItems = mainNav.find("a"),
      // Anchors corresponding to menu items
      scrollItems = menuItems.map(function () {
        if ($(this).attr('href')[0] === '#') {
          var item = $($(this).attr("href"));
          if (item.length) {
            return item;
          }
        }
      });

    // Bind to scroll
    $(window).scroll(function () {
      // Get container scroll position
      var fromTop = $(this).scrollTop() + mainNavHeight;

      // Get id of current scroll item
      var cur = scrollItems.map(function (cur) {

        const offset = $(this).attr('id') == 'contato' ? 80 : 0;
        if ($(this).offset().top < (fromTop + offset)) {
          return this;
        }
      });
      // Get the id of the current element
      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";
      // Set/remove active class

      if (scrollItems.length > 1) {
        menuItems
          .parent().removeClass("active")
          .end().filter("[href='#" + id + "']").parent().addClass("active");
      }
    });

    //keep params pagination fix
    $("a.keep-params").click(function (e) {
      if (window.location.search && !window.location.search.match(/\?page=\d/)) {
        e.preventDefault(), $(this).attr("href", $(this).attr("href").replace("?", "&"));
        var dest = window.location.search.replace(/\&page=\d/g, "") + $(this).attr("href");
        window.setTimeout(function () {
          window.location.href = dest
        }, 100)
      }
    });