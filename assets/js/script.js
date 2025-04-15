import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { gsap } from "gsap";
    
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import createGlobe from "cobe";

gsap.registerPlugin(Flip,ScrollTrigger,ScrollToPlugin,MotionPathPlugin);




const menuClose = document.querySelector('.close-menu');
const menuMenu = document.querySelector('.nav-bottom-menu');
const menuOpen = document.querySelector('.open-menu');



menuClose.addEventListener('click', ()=>{
    menuMenu.classList.remove('menu-reveal');
});menuOpen.addEventListener('click', ()=>{
    menuMenu.classList.add('menu-reveal');
});

const root = document.documentElement;

//animated number
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateNumber(element) {
  const start = parseInt(element.dataset.start);
  const end = parseInt(element.dataset.end);
  const duration = parseInt(element.dataset.duration);
  const startTime = performance.now();
  //const valueElement = element.querySelector('.value');
  const range = end - start;

  function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      progress = easeInOutCubic(progress);
      const currentValue = Math.floor(progress * range + start);
      /*valueE*/element.textContent = currentValue;

      if (progress < 1) {
          requestAnimationFrame(updateNumber);
      }
  }

  requestAnimationFrame(updateNumber);
}


// =======statics ==================

const popupStatistics = document.querySelectorAll('.statistics-bottom-item-btm');
const popupStatistics2 = document.querySelectorAll('.statistics-bottom-item-top');

// Set up Intersection Observer
const observer1 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          // Start animation when element comes into view
          const el = entry.target.querySelectorAll('.number');
          el.forEach(xt => {
            animateNumber(xt);
            
          });
         // Add visible class for opacity transition
         entry.target.classList.add('visible');



         popupStatistics.forEach((item)=>{
          gsap.fromTo(item,
            {scale:0},
            {
              scale:1,
              duration:3,
              ease:"elastic.out(1, 0.5)",
              // scrollTrigger:{
              //   trigger:popupStatistics,
              //   start:"top center",
              //   end:"bottom center",
              //   scrub:true
              // }
            }
          );
         });
         popupStatistics2.forEach((item)=>{
           
        gsap.fromTo(item,
          {scale:0},
          {
            scale:1,
            duration:3,
            ease:"elastic.out(1, 0.5)",
            // scrollTrigger:{
            //   trigger:popupStatistics,
            //   start:"top center",
            //   end:"bottom center",
            //   scrub:true
            // }
          }
        );
         });
         
          // Stop observing after animation triggers
          // observer1.unobserve(entry.target);
      }
  });
}, {
  threshold: 0.1, // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px' // Adjust trigger point
});

// Observe all number elements
document.querySelectorAll('.statistics-bottom-item, .content-statistics-top').forEach(element => {
  observer1.observe(element);
});


// social media sliding icon


if(document.querySelector('.marquee-section') !==  null){

  const elementDisplayed = getComputedStyle(root).getPropertyValue('--marquee-item-nbr');
  const marqueeContenair = document.querySelector('.marquee-elmts');
  
  root.style.setProperty('--marquee-elements-number-js', marqueeContenair.children.length);
  
  for(let i = 0; i<elementDisplayed; i++){
    marqueeContenair.appendChild(marqueeContenair.children[i].cloneNode(true));
  }
  
}

// swipper code =============================================================
if(document.querySelector('.hero_section') !==  null){
  const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function () {
        const videos = document.querySelectorAll('video');
        videos[0].play();
      },
      slideChangeTransitionStart: function () {
        const currentVideo = this.slides[this.activeIndex].querySelector('video');
        const previousVideo = this.slides[this.previousIndex].querySelector('video');
        previousVideo.pause();
        currentVideo.play();
      },
    },
  });  // Pause/Play Control
  const pauseBtn = document.querySelector('.pause-btn');
  let isPlaying = true;  // Intersection Observer setup
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Only play if autoplay is enabled and video is current slide
        if (isPlaying && entry.target.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
          video.play().catch(error => {
            console.log('Video autoplay prevented:', error);
          });
        }
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.5, // Trigger when 50% visible
    rootMargin: '0px'
  });  // Observe all videos
  document.querySelectorAll('.swiper-slide video').forEach(video => {
    observer.observe(video);
  });  pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      swiper.autoplay.stop();
      document.querySelector('.swiper-slide-active video').pause();
      pauseBtn.innerHTML = ':arrow_forward:';
    } else {
      swiper.autoplay.start();
      document.querySelector('.swiper-slide-active video').play();
      pauseBtn.innerHTML = ':double_vertical_bar:';
    }
    isPlaying = !isPlaying;
  });  // Pause when window loses visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.querySelector('.swiper-slide-active video')?.pause();
    } else if (isPlaying) {
      document.querySelector('.swiper-slide-active video')?.play();
    }
  });


}


  // menu nav animation gsap

  const navBarFlip = document.querySelector('.header-cotainer'); //navigation container
  const logoFlip = document.querySelector('.logo');
  const navTopFlip = document.querySelector('.nav-top');
  const navMenuFlip = document.querySelector('.nav-menu');
  const navSearchFlip = document.querySelector('.nav-search');
  const logoContainer = document.querySelector('.logo-img');
  const menuBurger = document.querySelector('.open-menu span img');

  // Register ScrollTrigger plugin
        // Create flip animation timeline
  const tl = gsap.timeline({
      scrollTrigger: {
          trigger: ".header-cotainer",
          start: "top top",
          scrub: true,
          markers: false // Remove this in production
      }
  });        // Animation sequence
function colorChangeMenu(){
   navBarFlip.classList.add('color-change');
   
}
function colorChangeMenuReverse(){
  navBarFlip.classList.remove('color-change');
}
function colorChangeMenuLogo(){
  navBarFlip.classList.add('color-change');
  logoContainer.src = '/repo-junias/assets/images/Logos/ONT1.svg';
  menuBurger.src = '/repo-junias/assets/images/icons/menu-burger-blue.png';
}
function colorChangeMenuReverseLogo(){
  navBarFlip.classList.remove('color-change');
  logoContainer.src = '/repo-junias/assets/images/Logos/ONT6.svg';
  menuBurger.src = '/repo-junias/assets/images/icons/menu-burger-white.png';
}
//   tl.to(logoFlip,{
//       rotationX: 360,
//       // backgroundColor: "#fff",
//       duration: 4,
//       ease: "power1.inOut",
//       onStart: colorChangeMenuLogo,
//       onReverseComplete: colorChangeMenuReverseLogo
//   }).to(navTopFlip,{
//     rotationX: 360,
//     // backgroundColor: "#fff",
//     duration: 6,
//     ease: "power1.inOut",
//     onStart:  colorChangeMenu,
//     onReverseComplete: colorChangeMenuReverse
// }).to(navMenuFlip,{
//   rotationX: 360,
//   // backgroundColor: "#fff",
//   duration: 4,
//   ease: "power1.inOut",
//   onStart:  colorChangeMenu,
//   onReverseComplete: colorChangeMenuReverse
// }).to(navSearchFlip,{
//   rotationX: 360,
//   // backgroundColor: "#fff",
//   duration: 4,
//   ease: "power1.inOut",
//   onStart:  colorChangeMenu,
//   onReverseComplete: colorChangeMenuReverse
// });

gsap.to(logoFlip,{
  
  // backgroundColor: "#fff",
  // duration: 4,
  // ease: "power1.inOut",
  onStart: colorChangeMenuLogo,
  onReverseComplete: colorChangeMenuReverseLogo,
  scrollTrigger: {
    trigger: ".header-cotainer",
    start: "top top",
    scrub: true,
    markers: false // Remove this in production
   }
});
gsap.to(navTopFlip,{


onStart:  colorChangeMenu,
onReverseComplete: colorChangeMenuReverse,
scrollTrigger: {
  trigger: ".header-cotainer",
  start: "top top",
  scrub: true,
  markers: false // Remove this in production
 }
});
gsap.to(navMenuFlip,{


onStart:  colorChangeMenu,
onReverseComplete: colorChangeMenuReverse,
scrollTrigger: {
  trigger: ".header-cotainer",
  start: "top top",
  scrub: true,
  markers: false // Remove this in production
 }
});
gsap.to(navSearchFlip,{


onStart:  colorChangeMenu,
onReverseComplete: colorChangeMenuReverse,
scrollTrigger: {
  trigger: ".header-cotainer",
  start: "top top",
  scrub: true,
  markers: false // Remove this in production
 }
});





// end menu nav animation

if(document.querySelector('.try-out') !==  null){


const canvas = document.getElementById("globeCanvas");
const el = document.getElementById("globeCanvas");
const globeContainer = document.querySelector('.globe-container');
const gridGlobeContainer = document.querySelector('.try-out_5');


// let phi = 0;
// let mapSamples = 14000;
// let r = 0;

if (!canvas) {
  console.error("Canvas element not found!");
}


let phi = 0;
let mapSamples = 14000;
let pointerInteracting = null;
let pointerInteractionMovement = 0;
let r = 0;

const globe = createGlobe(canvas, {
  devicePixelRatio: 2,
  width: 1000,
  height: 1000,
  phi: 0,
  theta: 0,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 14000,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [0.1, 0.8, 1],
  glowColor: [0.9, 0.8, 0.2],
  markers: [
    { location: [40.7128, -74.006], size: 0.05 }, // New York
    { location: [34.0522, -118.2437], size: 0.05 }, // Los Angeles
    { location: [-4.4419, 15.2663], size: 0.05 } // Kinshasa
  ],
  onRender: (state) => {
    // Called on every animation frame.
    // `state` will be an empty object, return updated params.
    state.phi = phi + r;
    phi += 0.0025;

    const lightTheta = Math.sin(state.phi);     // Daytime effect (with a warm glow)
  if (lightTheta > 0) {
      const lightTheta = Math.sin(state.phi); 
      state.glowColor = [
        Math.max(0, lightTheta), // Red fades in/out
        Math.max(0, lightTheta * 0.8), // Soft orange-yellow effect
        Math.max(0, lightTheta * 0.6)  // Sunset fade
      ];// Bright, white glow for daytime
      state.diffuse = 2;  // Strong lighting
  }    // Nighttime effect (with a cool glow)
  else {
      state.glowColor = [0.1, 0.1, 0.2]; // Blue glow for night
      state.diffuse = 0.5;  // Dim lighting
  }
  }
});



function down_handler(event) {
  pointerInteracting = event.clientX - pointerInteractionMovement;
  el.style.cursor = "grabbing";
}
function up_handler(event) {
  pointerInteracting = null;
  el.style.cursor = "grab";
}
function out_handler(event) {
  pointerInteracting = null;
  el.style.cursor = "grab";
}
function move_handler(event) {
  if (pointerInteracting !== null) {
    const delta = event.clientX - pointerInteracting;
    pointerInteractionMovement = delta;
    r = delta / 200;
    console.log(r);
  }
}

// Register pointer event handlers
el.onpointerdown = down_handler;
el.onpointerup = up_handler;
el.onpointerout = out_handler;
el.onpointermove = move_handler;

gsap.fromTo(gridGlobeContainer,
  { scale: 1.5}, //start :full screen
  {
    scale:1, //normal size
    duration:3,
    ease:"power2.out",
    scrollTrigger:{
      trigger:gridGlobeContainer,
      start:"top center",
      end:"center center",
      scrub:true,
    }

  }
);

}

