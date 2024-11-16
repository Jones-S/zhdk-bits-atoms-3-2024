console.log('🔨 _____ https://www.youtube.com/watch?v=otCpCn0l4Wo');

// https://hammerjs.github.io/getting-started/
const hammerPlayground = document.getElementById('hammer');
const hammerOptions = {};
const mc = new Hammer(hammerPlayground, hammerOptions);

// listen to pan, tap, press events
mc.on('panleft panright tap press', (event) => {
  hammerPlayground.textContent = event.type + ' gesture detected.';
});

// listen to a single event: minimal 2 taps
mc.on('singletap doubletap', (event) => {
  hammerPlayground.textContent = event.type + ' ';
  console.log('event: ', event);
});

// enabling rotate recognizer
// https://hammerjs.github.io/recognizer-rotate/
mc.get('rotate').set({ enable: true });

// only detectable on touch devices
mc.on('rotate', (event) => {
  hammerPlayground.textContent = event.type + ' ';
  hammerPlayground.textContent += `<br> ${event}`;
});
