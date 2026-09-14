// Отправка заявок (форма "Имя" + "Телефон") в Telegram-бота без перезагрузки страницы.
// Подключается на всех страницах: <script src="lead-form.js"></script>
(function () {
  var TG_TOKEN = '8945021082:AAFCv_daSsSsZQZ1vPqzvpbSkPehgg7ip9Y';
  var TG_CHAT_ID = '8274492658';

  function sendToTelegram(text) {
    return fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text })
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var nameInput = form.querySelector('[name="lead-name"]');
    var phoneInput = form.querySelector('[name="lead-phone"]');
    var commentInput = form.querySelector('[name="lead-comment"]');
    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name) { nameInput && nameInput.focus(); return; }
    if (!phone) { phoneInput && phoneInput.focus(); return; }

    var comment = commentInput ? commentInput.value.trim() : '';
    var btn = form.querySelector('button[type="submit"]');
    var originalLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }

    var text = 'Новая заявка с сайта GROWTH\n' +
      'Страница: ' + document.title + '\n' +
      'Имя: ' + name + '\n' +
      'Телефон: ' + phone +
      (comment ? '\nКомментарий: ' + comment : '');

    sendToTelegram(text)
      .then(function () {
        if (btn) btn.textContent = 'Отправлено ✓';
        form.reset();
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
          if (typeof closeModal === 'function' && form.closest('.modal')) closeModal();
        }, 1800);
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        alert('Не удалось отправить заявку. Напишите нам в WhatsApp — кнопка внизу справа.');
      });
  }

  function init() {
    document.querySelectorAll('form.lead-form').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
