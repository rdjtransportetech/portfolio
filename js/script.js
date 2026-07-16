/* =========================================================
   RDJ TRANSPORTE — Landing Page
   JavaScript Vanilla: header fixo, scroll suave,
   máscara de telefone, Web3Forms e consentimento do Analytics.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. HEADER FIXO — muda de cor ao rolar a página
  --------------------------------------------------------- */
  var header = document.getElementById('topo');
  var SCROLL_THRESHOLD = 60;

  function toggleHeaderBackground() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  toggleHeaderBackground();
  window.addEventListener('scroll', toggleHeaderBackground);

  /* ---------------------------------------------------------
     2. SCROLL SUAVE AO CLICAR NOS LINKS DO MENU
  --------------------------------------------------------- */
  var navLinks = document.querySelectorAll('a[href^="#"]');
  var navMenu = document.getElementById('navMenu');
  var bsCollapse = navMenu ? bootstrap.Collapse.getOrCreateInstance(navMenu, { toggle: false }) : null;

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      var headerOffset = header ? header.offsetHeight : 0;
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Fecha o menu mobile após clicar em um link
      if (bsCollapse && navMenu.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  /* ---------------------------------------------------------
     3. MÁSCARA DE TELEFONE — (99) 99999-9999
  --------------------------------------------------------- */
  var telefoneInput = document.getElementById('telefone');

  function aplicarMascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '').slice(0, 11);

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }

    return valor;
  }

  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      telefoneInput.value = aplicarMascaraTelefone(telefoneInput.value);
    });
  }

  /* ---------------------------------------------------------
     4. ENVIO DO FORMULÁRIO VIA WEB3FORMS
  --------------------------------------------------------- */
  var formOrcamento = document.getElementById('formOrcamento');
  var submitBtn = document.getElementById('btnEnviarOrcamento');
  var formFeedback = document.getElementById('formFeedback');

  function showFormFeedback(type, message) {
    if (!formFeedback) return;
    formFeedback.className = 'form-feedback form-feedback--' + type;
    formFeedback.textContent = message;
    formFeedback.classList.remove('d-none');
  }

  function hideFormFeedback() {
    if (!formFeedback) return;
    formFeedback.classList.add('d-none');
    formFeedback.textContent = '';
  }

  if (formOrcamento && submitBtn) {
    formOrcamento.addEventListener('submit', async function (event) {
      event.preventDefault();
      hideFormFeedback();

      if (!formOrcamento.checkValidity()) {
        formOrcamento.classList.add('was-validated');
        showFormFeedback('error', 'Preencha todos os campos obrigatórios.');
        return;
      }

      var accessKey = window.RDJ_CONFIG && window.RDJ_CONFIG.web3formsAccessKey;
      if (!accessKey) {
        showFormFeedback(
          'error',
          'Configuração ausente. Rode "node scripts/sync-env.js" para gerar js/config.js a partir do .env.'
        );
        return;
      }

      var formData = new FormData(formOrcamento);
      formData.append('access_key', accessKey);

      var btnLabel = submitBtn.querySelector('.btn-label');
      var originalText = btnLabel ? btnLabel.textContent : submitBtn.textContent;
      if (btnLabel) {
        btnLabel.textContent = 'Enviando...';
      } else {
        submitBtn.textContent = 'Enviando...';
      }
      submitBtn.disabled = true;

      try {
        var response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        var data = await response.json();

        if (response.ok && data.success) {
          showFormFeedback('success', 'Solicitação enviada com sucesso! Em breve entraremos em contato.');
          formOrcamento.reset();
          formOrcamento.classList.remove('was-validated');
        } else {
          showFormFeedback('error', 'Erro: ' + (data.message || 'Não foi possível enviar. Tente novamente.'));
        }
      } catch (error) {
        showFormFeedback('error', 'Algo deu errado. Verifique sua conexão e tente novamente.');
      } finally {
        if (btnLabel) {
          btnLabel.textContent = originalText;
        } else {
          submitBtn.textContent = originalText;
        }
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------------------------------------------------------
     5. ANO ATUAL NO RODAPÉ
  --------------------------------------------------------- */
  var anoAtualEl = document.getElementById('anoAtual');
  if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     6. REVEAL AO ROLAR — seções e cards aparecem na tela
  --------------------------------------------------------- */
  var preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSelector = [
    'main > section:not(#home)',
    '.pillar-card',
    '.service-card',
    '.event-badge',
    '.region-card',
    '.contact-card',
    '.faq-item',
    '.hero-text',
    '.step-card',
    '.stat-card',
    '.testimonial-card',
    '.gallery-item',
    '.inclusao-card',
    '.brand-logo-card',
    '.cta-mid-box'
  ].join(', ');

  var revealElements = document.querySelectorAll(revealSelector);

  function marcarVisible(el) {
    el.classList.add('is-visible');
  }

  if (preferReducedMotion) {
    revealElements.forEach(marcarVisible);
  } else {
    revealElements.forEach(function (el, index) {
      el.classList.add('reveal');
      if (!el.matches('main > section')) {
        el.style.setProperty('--reveal-delay', ((index % 6) * 0.08) + 's');
      }
    });

    document.querySelectorAll('.hero-text, #home').forEach(function (el) {
      el.classList.add('reveal', 'is-visible');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          marcarVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });
  }

  /* ---------------------------------------------------------
     7. CONSENTIMENTO DE COOKIES + GOOGLE ANALYTICS (gtag)
        - Só carrega o gtag se o usuário clicar em "Permitir"
        - Se recusar, nenhum script de analytics é injetado
  --------------------------------------------------------- */
  var GA_MEASUREMENT_ID = 'G-XPPNHWXG1B';
  var CONSENT_STORAGE_KEY = 'rdj_analytics_consent';
  var cookieConsent = document.getElementById('cookieConsent');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieReject = document.getElementById('cookieReject');

  function loadGoogleAnalytics() {
    if (window.__rdjGtagLoaded) return;
    window.__rdjGtagLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function hideConsentCard() {
    if (cookieConsent) {
      cookieConsent.classList.add('d-none');
    }
  }

  function showConsentCard() {
    if (cookieConsent) {
      cookieConsent.classList.remove('d-none');
    }
  }

  var savedConsent = null;
  try {
    savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch (e) {
    savedConsent = null;
  }

  if (savedConsent === 'accepted') {
    loadGoogleAnalytics();
    hideConsentCard();
  } else if (savedConsent === 'rejected') {
    hideConsentCard();
  } else {
    showConsentCard();
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
      } catch (e) { /* storage indisponível */ }
      loadGoogleAnalytics();
      hideConsentCard();
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'rejected');
      } catch (e) { /* storage indisponível */ }
      hideConsentCard();
      // Não carrega gtag — nenhum dado de analytics é capturado
    });
  }

});
