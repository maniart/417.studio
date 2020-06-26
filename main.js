const fullbleed = document.querySelector('.fullbleed');
const imageSrc = fullbleed.getAttribute('data-background');
const colorFade = document.querySelector('color-fade');
fullbleed.style.backgroundImage = `url(${imageSrc})`;

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let fullbleedBgSize = { w: 1224, h: 792 }

function updateFullbleedBg(e) {
  fullbleed.style.backgroundPositionX = `${lerp(e.clientX, e.offsetX, 1) - fullbleedBgSize.w * 1.5}px`;
  fullbleed.style.backgroundPositionY = `${lerp(e.clientY, e.offsetY, 1) - fullbleedBgSize.h * 1.5}px`;
}

fullbleed.addEventListener('mousemove', (e) => {
  // updateFullbleedBg(e);
});

const threshold = [];
for (let i = 0; i < 100; i++) {
  threshold.push(i / 100);
}

class ScrollFade {
  constructor(selector, options, lerpFn, easingFn = x => x) {
    const threshold = [];
    for (let i = 0; i < 100; i++) {
      threshold.push(i / 100);
    }
    this.el = document.querySelector(selector);
    this.options = options || { root: null, rootMargin: '0px', threshold };
    this.lastOpacity = 0;
    this.callback = (entries, observer) => {
      entries.forEach(entry => {
        this.el.style.opacity = lerpFn(this.lastOpacity, entry.intersectionRatio, 1) * easingFn(entry.intersectionRatio);
        this.lastOpacity = entry.intersectionRatio;
      });
    };
    this.observer = new IntersectionObserver(this.callback, this.options);
    this.observer.observe(this.el);
  }


}

const scrollFades = {
  fullBleed: new ScrollFade('#image-fade', null, lerp, EasingFunctions.easeInCubic),
  colorFade: new ScrollFade('#color-fade', null, lerp, EasingFunctions.easeInOutQuint)
}

const photoStackContainer = document.querySelector('.photo-stack-container');
const photoStack = document.querySelector('.photo-stack');
let photoIndex = 0;
let photoCount = photoStack.children.length;
photoStackContainer.addEventListener('click', () => {
  photoIndex++;
  renderPhotoStack(photoIndex, photoCount);
});



function renderPhotoStack(visibleIndex, total) {
  console.log(visibleIndex)
  Array.from(photoStack.children).forEach((photo, index) => {
    photo.style.display = 'none';
  });
  photoStack.children[visibleIndex % photoCount].style.display = 'block';
}

const layeredPhotoStack = document.querySelector('.photo-stack.layered');
const layeredPhotos = layeredPhotoStack.children;
Array.from(layeredPhotos).forEach((photo, index) => {
  photo.style.transform = `translate(${index - 50}%, ${index - 50}%)`
});

const gates = document.querySelector('.gates');
gates.addEventListener('click', ({clientX, clientY}) => {
  // console.log(event.clientX, event.clientY)
  const pct = { x: clientX * 100 / window.innerWidth, y : clientY * 100 / window.innerHeight }
  const gate = new Image();
  const width = 171;
  const height = 144;
  const gateDimensionsInPct = { w: width * 100 / window.innerWidth, h: height * 100 / window.innerHeight }
  console.log(pct.x - gateDimensionsInPct.w)

  let src;
  if(Math.random().toFixed(5) * Math.pow(10, 5) % 2 === 0) {
    src = './assets/single-gate-white.png'
  } else {
    src = './assets/single-gate-black.png'
  }
  gate.src = src;
  gate.classList.add('gate');
  console.log(pct.y - gateDimensionsInPct.h, pct.x - gateDimensionsInPct.w)
  gate.style.top = `${pct.y - (gateDimensionsInPct.h / 2)}%`;
  gate.style.left = `${pct.x - (gateDimensionsInPct.w / 2)}%`;
  gates.appendChild(gate);
});



