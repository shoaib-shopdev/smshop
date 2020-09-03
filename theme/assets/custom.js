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

if(window.location.pathname.indexOf('faqs-category') !== -1) {
    executeFaqsScript();
}

/* FAQs related custom script */
function executeFaqsScript() {
    $('.tab_contents:not(:first)').hide();
    $("#category-title").html($('#tabs_container .tab:first').html());
    
    let tabNodes = document.querySelectorAll('.tab');
    let pageUrl = window.location.pathname;
    let searchQuery = new URLSearchParams(window.location.search);
    let categoryId = searchQuery.get('category'); // route query param category id
    
    // active first tab by default if no query param exists
    if(!categoryId) {
        $('#tabs_container .tab:first').addClass('active');
    }

    for(let i=0; i<tabNodes.length; i++){
        let item = tabNodes[i];
        let itemCategory = item.getAttribute('data-category');
        if(itemCategory ===  categoryId) {
            if(!item.classList.contains('active')) {
                item.classList.add('active')
            }
            setTimeout(()=> { $(item).click() }, 10);
            break;
        }
    }
}

$('#tabs_container .tab').click(function() {
    var target = $(this.rel);
    $("#category-title").html(this.innerText);
    $('.tab_contents').not(target).hide();
    target.toggle();
    $('#tabs_container > .tabs > li > a.active').removeClass('active');
    $(this).addClass('active');
    $('#tabs_container > .tab_contents_container > div.tab_contents_active').removeClass('tab_contents_active');
  	$(this.rel).addClass('tab_contents_active');
});

/* Redirect Url for Login/Signup. Method being called from header.liquid */
function redirectMethod() {
    console.log('applying redirect')
    let redirectUrl = 'https://www-develop.smretailonline.com/login/?redirectUrl=https%3A%2F%2Fapi-develop.smretailonline.com/auth/shopify/sso';
    window.location.href = redirectUrl;
}


/* Method being called from page-faq-static-template.liquid */
function goToFaqsCategoryUrl() {
  let searchQuery = new URLSearchParams(window.location.search);
  let categoryId = searchQuery.get('category');
  window.location.pathname = '/pages/faqs-category';
}

