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


// FAQs custom script

$('.tab_contents:not(:first)').hide();
$("#category-title").html($('#tabs_container .tab:first').html());
$('.tab').click(function() {
    var target = $(this.rel);
    $("#category-title").html(this.innerText);
   
    $('.tab_contents').not(target).hide();
          target.toggle();
    $('#tabs_container > .tabs > li > a.active')
        .removeClass('active');

    $(this).addClass('active');

    $('#tabs_container > .tab_contents_container > div.tab_contents_active')
        .removeClass('tab_contents_active');

  	$(this.rel).addClass('tab_contents_active');
});

/* Redirect Url for My account */
function redirectMethod() {
  console.log('applying redirect')
  let redirectUrl = 'https://www-develop.smretailonline.com/login/?redirectUrl=https%3A%2F%2Fapi-develop.smretailonline.com/auth/shopify/sso';
  window.location.href = redirectUrl;
}

function goToFaqsCategoryUrl() {
  window.location.pathname = '/pages/faqs-category';
}

