var API_ROOT = 'https://api.noopschallenge.com';

function getJson(path) {
  return fetch(API_ROOT + path, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    }
  }).then(
    function(r) {
      if (!r.ok) throw new Error('Error fetching maze from' + path + '.');
      return r.json();
    }
  );
}

function postJson(path, body) {
  return fetch(API_ROOT + path, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  }).then(
    function(r) { return r.json(); }
  );
}
