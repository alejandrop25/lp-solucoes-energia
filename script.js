const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIcon = menuToggle?.querySelector('i');

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) return;

  mobileMenu.classList.remove('show');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');

  document.body.classList.remove('menu-open');

  if (menuIcon) {
    menuIcon.className = 'fa-solid fa-bars';
  }
}

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('show');

  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));

  document.body.classList.toggle('menu-open', open);

  if (menuIcon) {
    menuIcon.className = open
      ? 'fa-solid fa-xmark'
      : 'fa-solid fa-bars';
  }
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});


// ========================================
// MÁSCARA DO WHATSAPP
// ========================================

const whatsappInput = document.getElementById('whatsapp');

whatsappInput?.addEventListener('input', (event) => {
  let value = event.target.value
    .replace(/\D/g, '')
    .slice(0, 11);

  if (value.length > 10) {

    value = value.replace(
      /(\d{2})(\d{5})(\d{0,4})/,
      '($1) $2-$3'
    );

  } else if (value.length > 6) {

    value = value.replace(
      /(\d{2})(\d{4})(\d{0,4})/,
      '($1) $2-$3'
    );

  } else if (value.length > 2) {

    value = value.replace(
      /(\d{2})(\d{0,5})/,
      '($1) $2'
    );

  } else if (value.length) {

    value = value.replace(
      /(\d{0,2})/,
      '($1'
    );
  }

  event.target.value = value;
});


// ========================================
// SELEÇÃO RESIDENCIAL / COMERCIAL
// ========================================

const typeOptions = document.querySelectorAll('.type-option');

typeOptions.forEach(option => {

  option.addEventListener('click', () => {

    typeOptions.forEach(item => {
      item.classList.remove('active');
    });

    option.classList.add('active');

  });

});


// ========================================
// FORMULÁRIO
// ========================================

const leadForm = document.getElementById('leadForm');

const estimateBox = document.getElementById('estimateBox');

const estimateValue = document.getElementById('estimateValue');

const estimateText = document.getElementById('estimateText');

const whatsappCta = document.getElementById('whatsappCta');

const newSimulation = document.getElementById('newSimulation');


// ========================================
// VALIDAÇÕES
// ========================================

const validators = {

  nome: value =>
    value.trim().length >= 3 ||
    'Digite seu nome completo.',

  whatsapp: value =>
    value.replace(/\D/g, '').length >= 10 ||
    'Informe um WhatsApp válido.',

  email: value =>
    !value ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    'Informe um e-mail válido.',

  conta: value =>
    Boolean(value) ||
    'Selecione o valor médio da conta.'

};


// ========================================
// MOSTRAR ERROS NOS CAMPOS
// ========================================

function setFieldState(input, result) {

  const field = input.closest('.field');

  if (!field) return;

  const error = field.querySelector('.field-error');

  const valid = result === true;

  field.classList.toggle('invalid', !valid);

  if (error) {
    error.textContent = valid ? '' : result;
  }

}


// ========================================
// VALIDAR AO SAIR DO CAMPO
// ========================================

['nome', 'whatsapp', 'email', 'conta'].forEach(id => {

  const input = document.getElementById(id);

  input?.addEventListener('blur', () => {

    setFieldState(
      input,
      validators[id](input.value)
    );

  });

});


// ========================================
// ENVIO / SIMULAÇÃO
// ========================================

leadForm?.addEventListener('submit', (event) => {

  event.preventDefault();

  const fields = [
    'nome',
    'whatsapp',
    'email',
    'conta'
  ];

  let isValid = true;


  fields.forEach(id => {

    const input = document.getElementById(id);

    const result = validators[id](input.value);

    setFieldState(input, result);

    if (result !== true) {
      isValid = false;
    }

  });


  if (!isValid) {

    showToast(
      'Revise os campos destacados antes de continuar.'
    );

    return;

  }


  // ========================================
  // PEGANDO OS DADOS
  // ========================================

  const name = document
    .getElementById('nome')
    .value
    .trim()
    .split(' ')[0];


  const bill = Number(
    document.getElementById('conta').value
  );


  const selectedOption =
    document
      .getElementById('conta')
      .selectedOptions[0]
      ?.dataset.label || '';


  const type =
    document.querySelector(
      'input[name="tipo"]:checked'
    )?.value || 'Residencial';


  // ========================================
  // SIMULAÇÃO DE ECONOMIA
  // ========================================

  /*
    IMPORTANTE:

    Essa conta é apenas uma simulação
    para fins demonstrativos.

    Aqui estamos considerando
    aproximadamente 72% de economia.
  */

  const estimatedSaving =
    Math.round(bill * 0.72);


  const annualSaving =
    estimatedSaving * 12;


  // ========================================
  // MOSTRAR RESULTADO
  // ========================================

  estimateValue.textContent =
    `${formatBRL(estimatedSaving)}/mês`;


  estimateText.textContent =
    `${name}, considerando uma conta na faixa “${selectedOption}”, ` +
    `uma economia ilustrativa poderia chegar a aproximadamente ` +
    `${formatBRL(annualSaving)} por ano. ` +
    `O valor real depende do projeto técnico.`;



  // ========================================
  // MENSAGEM DO WHATSAPP
  // ========================================

  const whatsappMessage =
    encodeURIComponent(
      `Olá! Meu nome é ${document.getElementById('nome').value}. ` +
      `Fiz a simulação no site da Lumen Solar. ` +
      `Minha conta média está na faixa ${selectedOption} ` +
      `e o imóvel é ${type.toLowerCase()}. ` +
      `Gostaria de receber um estudo mais detalhado.`
    );


  /*
    TROQUE O NÚMERO ABAIXO PELO WHATSAPP REAL.

    Formato:

    55 + DDD + número

    Exemplo:

    5521999999999
  */

  whatsappCta.href =
    `https://wa.me/551140000000?text=${whatsappMessage}`;


  // ========================================
  // ESCONDER FORM E MOSTRAR RESULTADO
  // ========================================

  leadForm.hidden = true;

  estimateBox.hidden = false;


  showToast('Simulação concluída!');

});


// ========================================
// FAZER NOVA SIMULAÇÃO
// ========================================

newSimulation?.addEventListener('click', () => {

  estimateBox.hidden = true;

  leadForm.hidden = false;

  leadForm.reset();


  typeOptions.forEach(
    (item, index) => {

      item.classList.toggle(
        'active',
        index === 0
      );

    }
  );


  document
    .querySelectorAll('.field')
    .forEach(field => {

      field.classList.remove('invalid');

    });


  document
    .querySelectorAll('.field-error')
    .forEach(error => {

      error.textContent = '';

    });

});


// ========================================
// FORMATAR VALORES EM REAL
// ========================================

function formatBRL(value) {

  return new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }
  ).format(value);

}


// ========================================
// FAQ
// ========================================

const faqItems =
  document.querySelectorAll('.faq-item');


faqItems.forEach(item => {

  const button =
    item.querySelector('.faq-question');


  button?.addEventListener('click', () => {

    const wasOpen =
      item.classList.contains('open');


    faqItems.forEach(other => {

      other.classList.remove('open');

      other
        .querySelector('.faq-question')
        ?.setAttribute(
          'aria-expanded',
          'false'
        );

    });


    if (!wasOpen) {

      item.classList.add('open');

      button.setAttribute(
        'aria-expanded',
        'true'
      );

    }

  });

});


// ========================================
// TOAST / AVISO
// ========================================

const toast =
  document.getElementById('toast');

let toastTimer;


function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add('show');


  clearTimeout(toastTimer);


  toastTimer = setTimeout(() => {

    toast.classList.remove('show');

  }, 2600);

}


// ========================================
// ANO AUTOMÁTICO NO FOOTER
// ========================================

const currentYear =
  document.getElementById('currentYear');

if (currentYear) {

  currentYear.textContent =
    new Date().getFullYear();

}


// ========================================
// ANIMAÇÕES AOS
// ========================================

if (window.AOS) {

  AOS.init({

    once: true,

    duration: 650,

    offset: 70,

    easing: 'ease-out-cubic',

    disable:
      window
        .matchMedia(
          '(prefers-reduced-motion: reduce)'
        )
        .matches

  });

}