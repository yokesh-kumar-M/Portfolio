/*=============== SHOW MENU ===============*/
const navMenu = document.querySelector('#nav-menu'),
        navToggle = document.querySelector('#nav-toggle'),
        navClose = document.querySelector('#nav-close')

/*========= MENU SHOW =========*/
//Validar se a constante existe
if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
} 

/*========= MENU HIDDEN =========*/
//Validar se a constante existe
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}


/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')
    //quando clicado em cada 'nav__link', será removida a classe 'show-menu'
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))



/*=============== SHADOW HEADER ===============*/
const shadowlHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the shadow-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('shadow-header') 
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowlHeader)

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message')

const sendEmail = (e) =>{
    e.preventDefault()

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_hp1m2mh','template_z56cid4','#contact-form','Fvu4N2-utszga0O2w')
    .then(() => {
           // Show sent message
           contactMessage.textContent = 'Message sent successfully ✅'

            // Remove message after five seconds
            setTimeout(() => {
                contactMessage.textContent = ''
            }, 5000)
             // Clear input fields
             contactForm.reset()
    }, () => {
        // Show error message
        contactMessage.textContent = 'Message not sent (service error) ❌'
    })

}
contactForm.addEventListener('submit', sendEmail)

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)


/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Animations repeat
})

sr.reveal(`.home__perfil, .about__image, .contact__mail`, {origin:`right`})
sr.reveal(`.home__name, .home__info, 
            .about__container, .section__title-1, .about__info,
            .contact__social, .contact__data`, {origin:`left`})
sr.reveal(`.services__card, .projects__card`, {interval:`100`})
sr.reveal(`.resume__container`, { origin: 'top' });
sr.reveal(`.resume__description`, { origin: 'top' });
sr.reveal(`.resume__subtitle`, { origin: 'bottom' });
sr.reveal(`.resume__card`, {
  interval: 100,
  origin: 'bottom',
  distance: '40px',
  duration: 800,
});
/*=============== SCROLL REVEAL ANIMATION FOR SKILLS ===============*/
const srSkills = ScrollReveal({
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    delay: 200,
    reset: false
  });
  
  srSkills.reveal('.skills__container .skill__item', {
    interval: 100
  });

  function toggleCerts() {
    const moreCerts = document.getElementById("more-certs");
    const toggleBtn = document.getElementById("cert-toggle");
  
    if (moreCerts.classList.contains("hidden")) {
      moreCerts.classList.remove("hidden");
      toggleBtn.innerText = "View Less";
    } else {
      moreCerts.classList.add("hidden");
      toggleBtn.innerText = "View More";
    }
  }
// View More toggle for certifications
// View More toggle for certifications
const toggleBtn = document.getElementById("toggleCerts");
const hiddenCerts = document.querySelectorAll(".cert__hidden");

toggleBtn.addEventListener("click", () => {
  hiddenCerts.forEach(cert => {
    cert.classList.toggle("cert__hidden");
    // Re-apply ScrollReveal animation to newly revealed cards
    if (!cert.classList.contains("cert__hidden")) {
      ScrollReveal().reveal(cert, {
        origin: "bottom",
        distance: "40px",
        duration: 1000,
        interval: 200,
        reset: false // Prevent re-animation on subsequent toggles
      });
    }
  });
  toggleBtn.textContent =
    toggleBtn.textContent === "View More" ? "View Less" : "View More";
});

// Initial ScrollReveal animation for visible cards
ScrollReveal().reveal(".cert__reveal:not(.cert__hidden)", {
  origin: "bottom",
  distance: "40px",
  duration: 1000,
  interval: 200,
});

// ScrollReveal animation for coding profiles
ScrollReveal().reveal(".coding__reveal", {
    origin: "bottom",
    distance: "40px",
    duration: 1000,
    interval: 200,
  });

// ScrollReveal animation for day in my life
ScrollReveal().reveal(".day__reveal", {
    origin: "bottom",
    distance: "40px",
    duration: 1000,
    interval: 200,
  });

// Active link on scroll with Contact Me exception
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + 100; // Add offset to trigger early

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                const linkId = link.getAttribute('href').substring(1);
                if (linkId === section.id && linkId !== 'contact') {
                    link.classList.add('active-link');
                }
            });
        }
    });
});

const toggleButton = document.getElementById('projectToggle');
const hiddenProjects = document.querySelectorAll('.hide');

let isExpanded = false;

toggleButton.addEventListener('click', () => {
    isExpanded = !isExpanded;
    hiddenProjects.forEach(project => {
        project.style.display = isExpanded ? 'block' : 'none';
    });
    toggleButton.textContent = isExpanded ? 'View Less' : 'View More';
});

// <!--=============Loading animation============-->
document.addEventListener("DOMContentLoaded", function () {
  // === Loading Animation Setup ===
  const quoteText = document.querySelector(".quote-text");
  const loadingOverlay = document.querySelector(".loading-overlay");

  // Split each word into individual characters
  const words = document.querySelectorAll(".word");
  words.forEach(word => {
    const chars = word.textContent.split("");
    word.innerHTML = chars.map(char => `<span>${char}</span>`).join("");
  });

  const totalAnimationTime = 3000; // 3 seconds
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
    console.log("Loading overlay hidden, cursor should be visible now.");
  }, totalAnimationTime);

});









  
  
