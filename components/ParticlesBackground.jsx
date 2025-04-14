import { useEffect, useState } from 'react';

export default function ParticlesBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);

    // Load particles.js only on the client side
    const loadParticles = async () => {
      try {
        // Dynamically import the particles.js script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
        script.async = true;
        script.onload = () => {
          // Once the script is loaded, initialize particles
          if (window.particlesJS) {
            window.particlesJS('particles-js', {
              "particles": {
                "number": {
                  "value": 80,
                  "density": {
                    "enable": true,
                    "value_area": 800
                  }
                },
                "color": {
                  "value": "#FA3811"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 0,
                    "color": "#000000"
                  },
                  "polygon": {
                    "nb_sides": 5
                  }
                },
                "opacity": {
                  "value": 0.1,
                  "random": true,
                  "anim": {
                    "enable": true,
                    "speed": 0.5,
                    "opacity_min": 0,
                    "sync": false
                  }
                },
                "size": {
                  "value": 2,
                  "random": true,
                  "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                  }
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#FA3811",
                  "opacity": 0.1,
                  "width": 1
                },
                "move": {
                  "enable": true,
                  "speed": 1,
                  "direction": "none",
                  "random": true,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                  }
                }
              },
              "interactivity": {
                "detect_on": "canvas",
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "grab"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "push"
                  },
                  "resize": true
                },
                "modes": {
                  "grab": {
                    "distance": 140,
                    "line_linked": {
                      "opacity": 0.2
                    }
                  },
                  "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                  },
                  "repulse": {
                    "distance": 200,
                    "duration": 0.4
                  },
                  "push": {
                    "particles_nb": 4
                  },
                  "remove": {
                    "particles_nb": 2
                  }
                }
              },
              "retina_detect": true
            });
          }
        };
        document.body.appendChild(script);

        return () => {
          // Clean up the script tag when component unmounts
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          // Clean up particles instance if it exists
          if (window.pJSDom && window.pJSDom.length) {
            window.pJSDom.forEach(dom => dom.pJS.fn.vendors.destroypJS());
            window.pJSDom = [];
          }
        };
      } catch (error) {
        console.error('Failed to load particles:', error);
      }
    };

    loadParticles();
  }, []); // Empty dependency array ensures this runs once when component mounts

  // Only render the div on the client side to avoid hydration issues
  if (!isClient) return null;
  
  return (
    <div id="particles-js" className="absolute inset-0 z-0"></div>
  );
}
