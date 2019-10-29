const accordionNode = document.querySelector(".Accordion");

const loadSectionsFromJSONFile = () => {
  const loadingNode = document.querySelector(".Loading");
  loadingNode.textContent = "Loading...";
  const errorNode = document.querySelector(".Error");
  errorNode.textContent = "";

  setTimeout(() => {
    fetch("/section.json")
      .then(response => response.json())
      .then(responseJson => {
        const sectionsFragment = createNewSections(responseJson);
        accordionNode.appendChild(sectionsFragment);
        loadingNode.textContent = "";
      })
      .catch(error => {
        errorNode.textContent = `Error: ${error.message}`;
        loadingNode.textContent = "";
      });
  }, 3000); // Note: to simulate fetch delay
};

const createNewSections = sectionJson => {
  const sectionsFragment = document.createDocumentFragment();

  sectionJson.forEach(section => {
    const accordionTitle = document.createElement("dt");
    accordionTitle.className = "Accordion-title";
    accordionTitle.textContent = section.title;

    const accordionPanel = document.createElement("dd");
    accordionPanel.className = "Accordion-panel";
    const paragraph = document.createElement("p");
    paragraph.textContent = section.content;
    accordionPanel.appendChild(paragraph);
    stopNodeClickEventPropagation(accordionPanel);

    sectionsFragment.appendChild(accordionTitle);
    sectionsFragment.appendChild(accordionPanel);
  });

  return sectionsFragment;
};

const stopNodeClickEventPropagation = node =>
  (node.onclick = event => event.stopPropagation());

// Stop Panel propagation in order to avoid closing accordions
// when clicking panels due to event bubbling
const stopInitialRenderedPanelsClickEventPropagation = () => {
  const accordionPanelsHTMLCollection = document.getElementsByClassName(
    "Accordion-panel"
  );
  const accordionPanelsArray = [...accordionPanelsHTMLCollection];
  accordionPanelsArray.forEach(stopNodeClickEventPropagation);
};

const onAccordionClick = event => {
  const accordionTitlesHTMLCollection = document.getElementsByClassName(
    "Accordion-title"
  );
  const accordionTitlesArray = [...accordionTitlesHTMLCollection];
  accordionTitlesArray.forEach(accordionTitleNode => {
    const isClicked = accordionTitleNode === event.target;

    if (isClicked) {
      toggleActiveClass(accordionTitleNode);
      return;
    }

    removeActiveClass(accordionTitleNode);
  });
};

const toggleActiveClass = accordionTitleNode => {
  const panel = accordionTitleNode.nextElementSibling;
  accordionTitleNode.classList.toggle("is-active");
  panel.classList.toggle("is-active");
};

const removeActiveClass = accordionTitleNode => {
  const panel = accordionTitleNode.nextElementSibling;
  accordionTitleNode.classList.remove("is-active");
  panel.classList.remove("is-active");
};

// on page load
window.addEventListener("load", () => {
  accordionNode.addEventListener("click", onAccordionClick);
  stopInitialRenderedPanelsClickEventPropagation();
  loadSectionsFromJSONFile();
});
