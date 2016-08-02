function init() {
  window.addEventListener('scroll', function(e) {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
        header = document.querySelector('header');
    if (distanceY > 0) {
      header.classList.add('small');
    } else {
      header.classList.remove('small');
    }
  });

  /* Service Worker! */
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function() {
        console.log('Service Worker registered.');
      }, function(){
        console.log('Service Worker registration failed.');
      });

    // Listen for claiming of the Service Worker
    navigator.serviceWorker.addEventListener('controllerchange', function(event) {
      // Listen for changes in the state of the Service Worker
      navigator.serviceWorker.controller.addEventListener('statechange', function() {
        // If the Service Worker is "activated", we're ready to work offline!
        if (this.state === 'activated') {
          console.log('Service Worker activated. Future visits will work offline!');
        }
      });
    });
  }
}
window.onload = init();
