const socket = io('http://localhost:3000'); // this is a '/' namespace/endpoint

// this listener i just for testing. Not required. We can remove it.
socket.on('connect', () => {
  console.log(socket.id + ' connected.');
});

// listen for 'nsList' event, which will have all namespaces
socket.on('nsList', (nsData) => {
  /* 3. UPDATE DOM WITH NAMESPACE DATA */
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    // 'ns' is a random attribute here
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`;
  });

  // Add click listeners for each NAMESPACE
  Array.from(document.getElementsByClassName('namespace')).forEach(
    (nsElement) => {
      nsElement.addEventListener('click', (event) => {
        const endpoint = nsElement.getAttribute('ns'); // get endpoint name attached to 'ns' attribute of 'namespace' div
        console.log(`${endpoint} I should go to now.`);
      });
    }
  );

  // join NS
  joinNS('/wiki');
});
