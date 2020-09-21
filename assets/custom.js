/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

$(document).ready(() => {
  activeNavList();
  $(".logout-link").on("click", function (e) {
    clearCartOnLogout(e);
  });
});

/* Redirect to SSO Login if theme login visited */
if (window.location.pathname === "/account/login") {
  redirectMethod();
}

if (window.location.pathname.indexOf("faqs-category") !== -1) {
  executeFaqsScript();
}

/**
 * Clear cart on logout
 */
function clearCartOnLogout(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/cart/clear.js",
    success: function () {
      window.location.href = "/account/logout";
    },
    dataType: "json",
  });
}

/**
 * Active nav tab from nav list once the user is logged-in and viewing one of the nav item i.e. My Addresses, My Loyalty Cards, My Orders etc.
 */
function activeNavList() {
  let currentPathName = window.location.pathname;
  const navList = $(".card__linklist-item");
  navList.removeClass("text--strong");
  let foundNavAnchor;
  for (let i = 0; i < navList.length; i++) {
    let item = navList[i];
    if ($(item).attr("href") === currentPathName) {
      foundNavAnchor = item;
      break;
    }
  }
  if (foundNavAnchor) {
    $(foundNavAnchor).addClass("text--strong");
  }
}

/* FAQs related custom script */
function executeFaqsScript() {
  $(".tab_contents:not(:first)").hide();
  $("#category-title").html($("#tabs_container .tab:first").html());

  let tabNodes = document.querySelectorAll(".tab");
  let pageUrl = window.location.pathname;
  let searchParams = new URLSearchParams(window.location.search);
  let categoryId = searchParams.get("category"); // route query param category id

  /* Hack: if FAQs is visited through url /pages/click-and-collect then add query param (i.e.category) of 'Click and Collect' explicitly */
  if (document.referrer.indexOf("collect") !== -1) {
    searchParams.set("category", 5);
    categoryId = searchParams.get("category");
  }

  /* Hack: active first tab by default if no query param exists */
  if (!categoryId) {
    $("#tabs_container .tab:first").addClass("active");
  }

  for (let i = 0; i < tabNodes.length; i++) {
    let item = tabNodes[i];
    let itemCategory = item.getAttribute("data-category");
    if (itemCategory === categoryId) {
      if (!item.classList.contains("active")) {
        item.classList.add("active");
      }
      setTimeout(() => {
        $(item).click();
      }, 10);
      break;
    }
  }
}

/* Show respective category articles based on tab/category-title click */
$("#tabs_container .tab").click(function () {
  /* Disable clicking the same tab more than once */
  $("#tabs_container > .tabs > li > .tab:not(.active)").removeAttr("disabled");
  if ($(this).attr("disabled") === "disabled") {
    return;
  }

  var target = $(this.rel);
  $("#category-title").html(this.innerText);
  $(".tab_contents").not(target).hide();
  target.toggle();
  $("#tabs_container > .tabs > li > a.active").removeClass("active");
  $(this).addClass("active");
  $(
    "#tabs_container > .tab_contents_container > div.tab_contents_active"
  ).removeClass("tab_contents_active");
  $(this.rel).addClass("tab_contents_active");

  $(this).attr("disabled", "disabled");
});

/* Redirect Url for Login/Signup. Method being called from header.liquid */
function redirectMethod() {
  console.log("applying redirect");
  let redirectUrl =
    "https://www-develop.smretailonline.com/login/?redirectUrl=https%3A%2F%2Fapi-develop.smretailonline.com/auth/shopify/sso";
  window.location.href = redirectUrl;
}

/* Method being called from page-faq-static-template.liquid */
function goToFaqsCategoryUrl() {
  window.location.pathname = "/pages/faqs-category";
}

/* Reset new address form in addresses.liquid */
function resetAdderessForm() {
  document.getElementById("address_form_new").reset();
}

/* Phone format in addresses.liquid */
$(".phone-input").keydown(function (e) {
  let oldvalue = $(this).val();
  let key = e.charCode || e.keyCode || 0;
  if (key != 8) {
    if ($(this).val().length === 3) {
      $(this).val($(this).val() + " ");
    }
    if ($(this).val().length === 7 || $(this).val().length === 11) {
      $(this).val($(this).val() + "-");
    }
  }
  setTimeout(() => {
    if (this.value.indexOf("+63") !== 0) {
      $(this).val(oldvalue);
    }
  }, 1);
});

// Custom Confirm Dialog
const ui = {
  confirm: async (message) => createConfirm(message),
};

const createConfirm = (message) => {
  return new Promise((complete, failed) => {
    $("#confirmMessage").text(message);
    $("#confirmYes").off("click");
    $("#confirmNo").off("click");
    $("#confirmYes").on("click", () => {
      $(".confirm").hide();
      complete(true);
    });
    $("#confirmNo").on("click", () => {
      $(".confirm").hide();
      complete(false);
    });
    $(".confirm").show();
  });
};

const showConfirmDialog = async (
  questionStr,
  allowCallback,
  callback,
  callbackParam
) => {
  const confirm = await ui.confirm(questionStr);
  if (confirm) {
    if (allowCallback && callbackParam) {
      callback(callbackParam);
    } else if (allowCallback && !callbackParam) {
      callback();
    }
  }
};

function addressRemoval(addressId) {
  showToast("Address deleted successfully");

  // Shopify.bind(showToast);
  setTimeout(() => {
    Shopify.postLink("/account/addresses/" + addressId + "?deleted=y", {
      parameters: {
        _method: "delete",
      },
    });
  }, 4000);

  return false;
}

// Toast/Snackbar
function showToast(message) {
  setTimeout(() => {
    let defaultMessage = "Updated";
    // Get the snackbar DIV/Element
    let toastEl = document.getElementById("snackbar");

    // Add the "show" class to DIV/Element
    toastEl.className = "show";
    message
      ? (toastEl.innerHTML = message)
      : (toastEl.innerHTML = defaultMessage);

    // After 5 seconds, remove 'show' class from DIV
    setTimeout(() => {
      toastEl.className = toastEl.className.replace("show", "");
    }, 5000);
  }, 3000);
}
/* Continue developing this method if we have to display schedules for each store in Our Stores page.sca-storelocator.liquid. If this functionality not needed remove it. */
function showLocatorInfo(e) {
  let target = e.currentTarget;
  let $el = $(e.currentTarget);

  let addressObj = {
    title: $el.find("#scasl-title").html(),
    address: $el.find("#scasl-address").html(),
    phone: $el.find("#scasl-phone").find("a").html(),
    schedule: $el.find("scasl-schedule").html(),
  };
}
