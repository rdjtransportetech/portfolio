/* =========================================================
   RDJ TRANSPORTE — Landing Page
   JavaScript Vanilla: header fixo, scroll suave,
   máscara de telefone e envio do formulário via WhatsApp.
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
     4. ENVIO DO FORMULÁRIO DE ORÇAMENTO VIA WHATSAPP
  --------------------------------------------------------- */
  var formOrcamento = document.getElementById('formOrcamento');
  var NUMERO_WHATSAPP = '11933323486'; // Substitua pelo número real da RDJ Transporte

  if (formOrcamento) {
    formOrcamento.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!formOrcamento.checkValidity()) {
        formOrcamento.classList.add('was-validated');
        return;
      }

      var nome = document.getElementById('nome').value.trim();
      var telefone = document.getElementById('telefone').value.trim();
      var tipoServico = document.getElementById('tipoServico').value.trim();
      var cidade = document.getElementById('cidade').value.trim();
      var mensagem = document.getElementById('mensagem').value.trim();

      var texto = 'Olá, RDJ Transporte! Meu nome é ' + nome + '.' +
        '\nTelefone: ' + telefone +
        '\nServiço desejado: ' + tipoServico +
        (cidade ? '\nCidade/Região: ' + cidade : '') +
        (mensagem ? '\nDetalhes: ' + mensagem : '');

      var link = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(texto);

      window.open(link, '_blank', 'noopener,noreferrer');
      formOrcamento.reset();
      formOrcamento.classList.remove('was-validated');
    });
  }

  /* ---------------------------------------------------------
     5. ANO ATUAL NO RODAPÉ
  --------------------------------------------------------- */
  var anoAtualEl = document.getElementById('anoAtual');
  if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
  }

});
