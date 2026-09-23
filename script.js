document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
DROPDOWN NAVIGATION
===================================================== */

const dropdowns = document.querySelectorAll(".dropdown");

function closeAllDropdowns() {
dropdowns.forEach(dropdown => {
dropdown.classList.remove("open");

  const button = dropdown.querySelector(".drop-btn");

  if (button) {
    button.setAttribute("aria-expanded", "false");
  }
});

}

dropdowns.forEach(dropdown => {

const button = dropdown.querySelector(".drop-btn");

if (!button) return;

button.addEventListener("click", event => {

  event.preventDefault();
  event.stopPropagation();

  const isOpen = dropdown.classList.contains("open");

  closeAllDropdowns();

  if (!isOpen) {
    dropdown.classList.add("open");

    button.setAttribute(
      "aria-expanded",
      "true"
    );
  }

});

});

/* =====================================================
CLOSE DROPDOWN WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener("click", event => {

if (!event.target.closest(".dropdown")) {
  closeAllDropdowns();
}

});
  ////////////////////////////////////
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    const isOpen = navMenu.classList.contains("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
  });

}

/* =====================================================
FORM PAGES
===================================================== */

const formPages =
document.querySelectorAll(".form-page");

function showFormPage(hash, shouldScroll = true) {

/* Hide every form page */

formPages.forEach(page => {
  page.classList.remove("active");
});


/* Nothing selected */

if (!hash || hash === "#") {
  return;
}


/* Find selected page */

const selectedPage =
  document.querySelector(hash);


/* Make sure it is actually a form page */

if (
  !selectedPage ||
  !selectedPage.classList.contains("form-page")
) {
  return;
}


/* Show selected page */

selectedPage.classList.add("active");


/* Scroll to it */

if (shouldScroll) {

  setTimeout(() => {

    const header =
      document.querySelector(".site-header");

    const headerHeight =
      header ? header.offsetHeight : 0;

    const targetPosition =
      selectedPage.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      15;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

  }, 50);

}

}

/* =====================================================
NAVIGATION LINKS
===================================================== *//* =====================================================
SECTION NAVIGATION
===================================================== */

const allSections = document.querySelectorAll("main > section");

/*
  These are the destinations that should behave as
  individual pages/views.
*/
const pageIds = [
  "home",
  "what-we-do",
  "mission",
  "vision",
  "objectives",
  "services",
  "mental-health",
  "rights",
  "mental-health-act",
  "outreach",
  "involved",
  "research",
  "team",
  "funders",
  "contact-us",
  "referral-form",
  "complaint",
  "story-form",
  "volunteer-form",
  "donate-form"
];


/* =====================================================
SHOW ONE SECTION
===================================================== */

function showPageSection(id, shouldScroll = true) {

  /* Hide every main section */
  allSections.forEach(section => {
    section.classList.remove("active");
  });


  /* Find requested section */
  const target = document.getElementById(id);

  if (!target) {
    console.warn("Section not found:", id);
    return;
  }


  /*
    If the ID belongs to a card/article inside another
    section, show that parent section for now.
  */
  const parentSection = target.closest("main > section");

  if (parentSection) {
    parentSection.classList.add("active");
  } else {
    target.classList.add("active");
  }


  /* Scroll to top */
  if (shouldScroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


/* =====================================================
ALL NAVIGATION LINKS
===================================================== */

document.querySelectorAll("a[href^='#']").forEach(link => {

  link.addEventListener("click", event => {

    const hash = link.getAttribute("href");

    if (!hash || hash === "#") {
      return;
    }


    const id = hash.substring(1);

    const target = document.getElementById(id);

    /*
      If the target doesn't exist, leave the link alone.
    */
    if (!target) {
      return;
    }


    event.preventDefault();


    /* Close dropdown menus */
    closeAllDropdowns();


    /* Close mobile navigation */
    if (navMenu) {
      navMenu.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }


    /* Update browser URL */
    history.pushState(
      null,
      "",
      hash
    );


    /* Show selected section */
    showPageSection(id);

  });

});
/* =====================================================
ESCAPE KEY
===================================================== */

document.addEventListener("keydown", event => {

if (event.key === "Escape") {
  closeAllDropdowns();
}

});

/* =====================================================
FORM SUBMISSION — FORMGRID
===================================================== */
/* =====================================================
FORMS — WEB3FORMS
===================================================== */

const forms = document.querySelectorAll(
"form[data-form-name]"
);

forms.forEach(form => {

form.addEventListener("submit", async event => {

event.preventDefault();

/* -----------------------------------------------
   VALIDATE FORM
------------------------------------------------ */

if (!form.checkValidity()) {

  form.reportValidity();

  return;

}


/* -----------------------------------------------
   GET FORM ELEMENTS
------------------------------------------------ */

const message =
  form.querySelector(".form-message");

const button =
  form.querySelector(
    "button[type='submit']"
  );

const formName =
  form.dataset.formName || "form";


/* -----------------------------------------------
   CHECK ACCESS KEY
------------------------------------------------ */

const accessKey =
  form.querySelector(
    'input[name="access_key"]'
  );

if (
  !accessKey ||
  !accessKey.value ||
  accessKey.value === "YOUR_WEB3FORMS_ACCESS_KEY"
) {

  console.error(
    "Web3Forms access key is missing."
  );

  if (message) {

    message.textContent =
      "This form is not configured correctly. Please contact us at info@advoconnect.org.uk.";

    message.setAttribute(
      "role",
      "alert"
    );

  }

  return;

}


/* -----------------------------------------------
   BUTTON STATE
------------------------------------------------ */

let originalButtonHTML = "";

if (button) {

  originalButtonHTML =
    button.innerHTML;

  button.disabled = true;

  button.innerHTML =
    "Sending...";

}


/* -----------------------------------------------
   STATUS MESSAGE
------------------------------------------------ */

if (message) {

  message.textContent =
    "Sending...";

  message.setAttribute(
    "role",
    "status"
  );

  message.setAttribute(
    "aria-live",
    "polite"
  );

}


try {

  /* ---------------------------------------------
     COLLECT FORM DATA
  ---------------------------------------------- */

  const formData =
    new FormData(form);


  /* ---------------------------------------------
     SEND TO WEB3FORMS
  ---------------------------------------------- */

  const response =
    await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",

        headers: {
          "Accept":
            "application/json"
        },

        body: formData
      }
    );


  /* ---------------------------------------------
     READ RESPONSE
  ---------------------------------------------- */

  const result =
    await response.json();


  /* ---------------------------------------------
     SUCCESS
  ---------------------------------------------- */

  if (
    response.ok &&
    result.success
  ) {

    if (message) {

      message.textContent =
        getSuccessMessage(formName);

      message.setAttribute(
        "role",
        "status"
      );

    }


    /* Clear form */

    form.reset();

  }


  /* ---------------------------------------------
     WEB3FORMS ERROR
  ---------------------------------------------- */

  else {

    console.error(
      "Web3Forms error:",
      result
    );

    throw new Error(
      result.message ||
      "Form submission failed."
    );

  }

}


/* -----------------------------------------------
   NETWORK / SERVER ERROR
------------------------------------------------ */

catch (error) {

  console.error(
    "Form submission error:",
    error
  );


  if (message) {

    message.textContent =
      "Sorry, we could not send your form. Please try again or contact us at info@advoconnect.org.uk.";

    message.setAttribute(
      "role",
      "alert"
    );

  }

}


/* -----------------------------------------------
   RESTORE BUTTON
------------------------------------------------ */

finally {

  if (button) {

    button.disabled = false;

    button.innerHTML =
      originalButtonHTML;

  }

}

});

});

/* =====================================================
SUCCESS MESSAGES
===================================================== */

function getSuccessMessage(formName) {

switch (formName) {

case "Contact":

  return (
    "Thank you. Your message has been sent to AdvoConnect. We will get back to you as soon as possible."
  );


case "Referral":

  return (
    "Thank you. Your referral has been submitted successfully. We will review the information provided."
  );


case "Complaint":

  return (
    "Thank you. Your complaint has been submitted. We will treat your concerns seriously and respectfully."
  );


case "Story":

  return (
    "Thank you for sharing your story with AdvoConnect."
  );


case "Volunteer":

  return (
    "Thank you for your interest in volunteering with AdvoConnect. We have received your application."
  );


case "Donation":

  return (
    "Thank you for your support. Your information has been received."
  );


default:

  return (
    "Thank you. Your form has been submitted successfully."
  );
}}
/* =====================================================
COPYRIGHT YEAR
===================================================== */

const year =
document.getElementById("year");

if (year) {

year.textContent =
  new Date().getFullYear();

}

/* =====================================================
BROWSER BACK / FORWARD
===================================================== */
/* =====================================================
BROWSER BACK / FORWARD
===================================================== */

window.addEventListener(
  "popstate",
  () => {

    const hash =
      window.location.hash;


    /* Form page */

    const target =
      hash
        ? document.querySelector(hash)
        : null;


    if (
      target &&
      target.classList.contains("form-page")
    ) {

      showFormPage(
        hash,
        true
      );

      return;

    }


    /* Normal page section */

    if (
      target &&
      target.classList.contains("page-section")
    ) {

      showPageSection(
        hash
      );

      return;

    }

  }
);


/* =====================================================
INITIAL PAGE LOAD
===================================================== */
/* =====================================================
INITIAL PAGE LOAD
===================================================== */

const initialHash =
  window.location.hash;

const initialTarget =
  initialHash
    ? document.querySelector(initialHash)
    : null;


/* -----------------------------------------------
   FORM PAGE
------------------------------------------------ */

if (
  initialTarget &&
  initialTarget.classList.contains("form-page")
) {

  showFormPage(
    initialHash,
    false
  );

}


/* -----------------------------------------------
   NORMAL PAGE SECTION
------------------------------------------------ */

else if (
  initialTarget &&
  initialTarget.classList.contains("page-section")
) {

  showPageSection(
    initialHash
  );

}


/* -----------------------------------------------
   DEFAULT TO HOME
------------------------------------------------ */

else {

  showPageSection("#home");

}


});
