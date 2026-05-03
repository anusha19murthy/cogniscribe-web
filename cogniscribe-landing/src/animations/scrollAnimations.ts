import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = () => {
  // Fade up reveals
  gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Stagger children
  gsap.utils.toArray<HTMLElement>('.gsap-stagger-parent').forEach((parent) => {
    const children = parent.querySelectorAll('.gsap-stagger-child');
    gsap.fromTo(children,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Scale in
  gsap.utils.toArray<HTMLElement>('.gsap-scale-in').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1, duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Slide from left
  gsap.utils.toArray<HTMLElement>('.gsap-slide-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Slide from right
  gsap.utils.toArray<HTMLElement>('.gsap-slide-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
};

export const createParallax = (element: HTMLElement, speed = 0.3) => {
  gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
};

export { gsap, ScrollTrigger };
