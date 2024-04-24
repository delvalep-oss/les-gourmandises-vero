// Main script for Les Gourmandises de Véro

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive elements
  initializePayButtons();
  initializeScrollEffects();
});

// Initialize payment buttons
function initializePayButtons() {
  // Main CTA buttons
  const mainCta = document.getElementById('pay-cta');
  const bottomCta = document.getElementById('pay-cta-bottom');
  const packCta = document.getElementById('pay-cta-pack');
  
  // Add event listeners to all payment buttons
  if (mainCta) mainCta.addEventListener('click', handlePaymentClick);
  if (bottomCta) bottomCta.addEventListener('click', handlePaymentClick);
  if (packCta) packCta.addEventListener('click', handlePaymentClick);
}

// Smooth scroll effects
function initializeScrollEffects() {
  // Get all navigation links
  const links = document.querySelectorAll('a[href^="#"]');
  
  // Add smooth scroll to all internal links
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add scroll animations
  window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.benefit-card, .product-card, .pricing-card, .testimonial-card');
    
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      
      // If element is in viewport
      if (position.top < window.innerHeight && position.bottom >= 0) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  });
}

// Stripe Checkout integration
(function () {
  var root = document.documentElement;
  var apiBase = (root.getAttribute("data-leads-api-origin") || "").replace(/\/$/, "");
  var productSlug = root.getAttribute("data-product-slug") || "";
  var btn = document.getElementById("pay-cta");
  var statusEl = document.getElementById("pay-cta-status");
  if (!btn || !statusEl || !productSlug) return;
  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#f87171" : "#86efac";
    statusEl.style.marginTop = "0.75rem";
    statusEl.style.fontSize = "0.9rem";
    statusEl.setAttribute("role", "status");
  }
  btn.addEventListener("click", function () {
    setStatus("Redirection vers le paiement sécurisé (Stripe)…", false);
    btn.disabled = true;
    var url = (apiBase || "") + "/api/stripe/create-checkout-session";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_slug: productSlug })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, json: j }; }); })
      .then(function (res) {
        if (res.json && res.json.url) {
          window.location.href = res.json.url;
          return;
        }
        btn.disabled = false;
        var err = (res.json && res.json.error) ? res.json.error : "Paiement indisponible pour le moment.";
        setStatus(err, true);
      })
      .catch(function () {
        btn.disabled = false;
        setStatus("Réseau indisponible. Réessaie plus tard.", true);
      });
  });
})();

// Handle payment button clicks
function handlePaymentClick() {
  // This function is already handled by the Stripe Checkout integration above
  // The integration will take care of the payment flow
  
  // For the bottom CTA, we need to update its status element
  if (this.id === 'pay-cta-bottom') {
    const bottomStatusEl = document.getElementById('pay-cta-status-bottom');
    if (bottomStatusEl) {
      bottomStatusEl.textContent = "Redirection vers le paiement sécurisé (Stripe)…";
      bottomStatusEl.style.color = "#86efac";
      bottomStatusEl.style.marginTop = "0.75rem";
      bottomStatusEl.style.fontSize = "0.9rem";
      bottomStatusEl.setAttribute("role", "status");
    }
  }
  
  // For the pack CTA, we redirect to the main CTA
  if (this.id === 'pay-cta-pack') {
    const mainCta = document.getElementById('pay-cta');
    if (mainCta) {
      mainCta.click();
    }
  }
}