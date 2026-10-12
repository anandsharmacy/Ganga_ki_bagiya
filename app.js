const stories = [
  {
    category: "देश",
    title: "नई पहल से छोटे शहरों में भी बढ़ेंगे रोजगार के अवसर",
    meta: "देश · 25 मिनट पहले",
    art: "city",
  },
  {
    category: "खेल",
    title: "भारतीय टीम ने शानदार प्रदर्शन से मुकाबले में बनाई बढ़त",
    meta: "खेल · 42 मिनट पहले",
    art: "sport",
  },
  {
    category: "बिजनेस",
    title: "बाजार में तेजी, निवेशकों की नजर अब इन अहम संकेतों पर",
    meta: "बिजनेस · 1 घंटा पहले",
    art: "market",
  },
  {
    category: "दुनिया",
    title: "वैश्विक नेताओं की बैठक में सहयोग और विकास पर चर्चा",
    meta: "दुनिया · 1 घंटा पहले",
    art: "",
  },
];

const storyList = document.querySelector("#story-list");
const emptyState = document.querySelector(".empty-state");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".search-form");
const toast = document.querySelector(".toast");
let selectedCategory = "सभी";
let toastTimeout;

document.querySelector("#edition-date").textContent = new Intl.DateTimeFormat(
  "hi-IN",
  { weekday: "long", day: "numeric", month: "long" },
).format(new Date());

function bookmarkIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" /></svg>';
}

function renderStories() {
  const query = searchInput.value.trim().toLocaleLowerCase("hi");
  const filtered = stories.filter((story) => {
    const matchesCategory =
      selectedCategory === "सभी" || story.category === selectedCategory;
    const matchesQuery =
      !query || `${story.title} ${story.category}`.toLocaleLowerCase("hi").includes(query);
    return matchesCategory && matchesQuery;
  });

  storyList.innerHTML = filtered
    .map(
      (story) => `
        <article class="story-card">
          <div class="story-copy">
            <h3>${story.title}</h3>
            <span class="story-meta">${story.meta}</span>
            <button class="story-save" type="button" aria-label="खबर सेव करें" aria-pressed="false">${bookmarkIcon()}</button>
          </div>
          <div class="story-thumb ${story.art}" role="img" aria-label="${story.category} खबर"></div>
        </article>
      `,
    )
    .join("");

  emptyState.hidden = filtered.length !== 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelector(".category.active")?.classList.remove("active");
    button.classList.add("active");
    renderStories();
  });
});

document.querySelector(".search-toggle").addEventListener("click", () => {
  searchForm.hidden = !searchForm.hidden;
  if (!searchForm.hidden) searchInput.focus();
  else {
    searchInput.value = "";
    renderStories();
  }
});

document.querySelector(".search-close").addEventListener("click", () => {
  searchForm.hidden = true;
  searchInput.value = "";
  renderStories();
});

searchInput.addEventListener("input", renderStories);

document.addEventListener("click", (event) => {
  const saveButton = event.target.closest(".save-button, .story-save");
  if (!saveButton) return;
  const saved = saveButton.classList.toggle("saved");
  saveButton.setAttribute("aria-pressed", String(saved));
  if (saveButton.classList.contains("save-button")) {
    saveButton.querySelector("span").textContent = saved ? "सेव हो गया" : "सेव करें";
  }
  showToast(saved ? "खबर सेव की गई" : "सेव की गई खबर हटाई गई");
});

document.querySelector(".refresh-button").addEventListener("click", () => {
  renderStories();
  showToast("खबरें अपडेट की गईं");
});

document.querySelectorAll(".bottom-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".bottom-item.selected")?.classList.remove("selected");
    button.classList.add("selected");
    const section = button.dataset.section;
    showToast(section === "होम" ? "आप होम पर हैं" : `${section} जल्द उपलब्ध होगा`);
  });
});

document.querySelector(".location-button").addEventListener("click", () => {
  showToast("शहर चुनने की सुविधा जल्द उपलब्ध होगी");
});

renderStories();
