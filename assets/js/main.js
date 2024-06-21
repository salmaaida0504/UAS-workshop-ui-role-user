(function ($) {
  "use strict";

  // Initiate the wowjs
  new WOW().init();

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    // Check screen size
    if (this.matchMedia("(min-width: 992px)").matches) {
      // Enable hover for large screens
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      // Enable click for small screens
      $dropdown.off("mouseenter mouseleave").on("click", function (e) {
        const $this = $(this);
        $this.toggleClass(showClass);
        $this
          .find($dropdownToggle)
          .attr("aria-expanded", $this.hasClass(showClass));
        $this.find($dropdownMenu).toggleClass(showClass);

        // Close other open dropdowns
        $dropdown
          .not($this)
          .removeClass(showClass)
          .find($dropdownMenu)
          .removeClass(showClass);
        e.stopPropagation();
      });

      // Close dropdown when clicking outside
      $(document).on("click", function (e) {
        if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
          $dropdown
            .removeClass(showClass)
            .find($dropdownMenu)
            .removeClass(showClass);
        }
      });
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  // Nav item active state management
  $(document).ready(function () {
    const navItems = $(".nav-item a");

    // Adding event listener for click on each nav item
    navItems.on("click", function (event) {
      // Stopping the default behavior of the anchor
      event.preventDefault();

      // Removing the 'active' class from all nav-items
      navItems.removeClass("active");

      // Adding the 'active' class to the clicked element
      $(this).addClass("active");

      // Navigate to the desired section
      const target = $(this).attr("href");
      if (target && target !== "#") {
        // Scroll to the section if it's an internal link
        if (target.startsWith("#")) {
          $("html, body").animate({ scrollTop: $(target).offset().top }, 1000);
        } else {
          // Navigate to the external page
          window.location.href = target;
        }
      }
    });
  });

  // Add quantity change listener
  $('.product-quantity input[type="number"]').change(function () {
    // Calculate and update total for this row
    var quantity = $(this).val();
    var price = $(this)
      .closest(".table-body-row")
      .find(".product-price")
      .text()
      .replace("$", "");
    var total = quantity * price;
    $(this)
      .closest(".table-body-row")
      .find(".product-total")
      .text("$" + total);

    // Update subtotal, shipping and total
    updateCartTotal();
  });

  // Remove product from cart
  $(".product-remove a").click(function (e) {
    e.preventDefault();
    $(this).closest(".table-body-row").remove();

    // Update subtotal, shipping and total
    updateCartTotal();
  });

  // Function to update cart total
  function updateCartTotal() {
    var subtotal = 0;

    $(".table-body-row").each(function () {
      var quantity = $(this)
        .find('.product-quantity input[type="number"]')
        .val();
      var price = $(this).find(".product-price").text().replace("$", "");
      var total = quantity * price;
      $(this)
        .find(".product-total")
        .text("$" + total);
      subtotal += total;
    });

    var shipping = 45; // Assuming shipping is fixed at $45
    var total = subtotal + shipping;

    $(".total-data:eq(0) td:eq(1)").text("$" + subtotal);
    $(".total-data:eq(1) td:eq(1)").text("$" + shipping);
    $(".total-data:eq(2) td:eq(1)").text("$" + total);
  }

  // File: assets/js/main.js

document.addEventListener('DOMContentLoaded', function () {
  // Dapatkan semua elemen layanan di modal
  var serviceItems = document.querySelectorAll('#serviceModal .list-group-item');

  // Iterasi melalui setiap layanan dan tambahkan event listener
  serviceItems.forEach(function (item) {
      item.addEventListener('click', function (event) {
          event.preventDefault(); // Mencegah link default behavior

          // Ambil data layanan
          var serviceId = this.getAttribute('data-id');
          var serviceName = this.getAttribute('data-name');
          var serviceDescription = this.getAttribute('data-description');

          // Tambahkan layanan ke keranjang
          addToCart(serviceId, serviceName, serviceDescription);
      });
  });

  function addToCart(id, name, description) {
      // Dapatkan tabel keranjang
      var cartTable = document.querySelector('.cart-table tbody');

      // Periksa apakah layanan sudah ada di keranjang
      var existingRow = cartTable.querySelector('[data-id="' + id + '"]');

      if (existingRow) {
          // Jika sudah ada, tambahkan kuantitas
          var quantityCell = existingRow.querySelector('.product-total');
          var currentQuantity = parseInt(quantityCell.textContent, 10);
          quantityCell.textContent = currentQuantity + 1;
      } else {
          // Jika tidak ada, tambahkan baris baru
          var newRow = document.createElement('tr');
          newRow.classList.add('table-body-row');
          newRow.setAttribute('data-id', id);

          newRow.innerHTML = `
              <td class="product-remove">
                  <a href="#" class="remove-service"><i class="far fa-window-close" style="color: #033c3d"></i></a>
              </td>
              <td class="product-name">${name}</td>
              <td class="product-name">${description}</td>
              <td class="product-total">1</td>
          `;

          cartTable.appendChild(newRow);
      }

      // Perbarui total layanan
      updateTotalServices();
  }

  function updateTotalServices() {
      var totalCell = document.querySelector('.total-data td:last-child');
      var totalServices = document.querySelectorAll('.cart-table tbody tr').length;
      totalCell.textContent = totalServices;
  }

  // Event listener untuk menghapus layanan dari keranjang
  document.querySelector('.cart-table').addEventListener('click', function (event) {
      if (event.target.closest('.remove-service')) {
          event.preventDefault();
          var row = event.target.closest('tr');
          row.remove();
          updateTotalServices();
      }
  });
});

})(jQuery);
