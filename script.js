// La fletxa de dalt a l'esquerra torna a la pàgina anterior (per exemple,
// des d'un projecte torna al llistat). Si s'ha obert la pàgina directament
// (sense pàgina anterior de la mateixa web), va a la portada.
document.addEventListener('DOMContentLoaded', function () {
  var back = document.querySelector('.nav a:first-child');
  if (!back) return;

  back.setAttribute('aria-label', 'Enrere');
  back.setAttribute('title', 'Enrere');

  back.addEventListener('click', function (e) {
    var ref = document.referrer;
    var sameSite = false;
    try {
      sameSite = ref !== '' && new URL(ref).origin === location.origin;
    } catch (err) {
      sameSite = false;
    }
    if (sameSite && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });
});
