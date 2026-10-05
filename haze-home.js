(function () {
  var runLink = document.getElementById('run-haze');
  if (runLink) runLink.addEventListener('click', function () {
    var destination = new URL(runLink.href, location.href);
    destination.searchParams.delete('once');
    destination.searchParams.delete('resume');
    try {
      var token = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      sessionStorage.setItem('haze-start-once', token);
      if (sessionStorage.getItem('haze-start-once') === token)
        destination.searchParams.set('once', token);
    } catch (_) {}
    runLink.href = destination.href;
  });
  // Existing recovery links still enter the same runner with their options intact.
  var options = new URLSearchParams(location.search);
  if (options.has('loader') || options.has('manual') || options.has('browser')) {
    location.replace('run.html' + location.search); return;
  }
})();
