document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
      }
    });
  }

  const products = [
    ["Espresso da casa","cafes","R$ 9","DA CASA","Curto, doce e intenso. Grão brasileiro moído na hora, extraído sem pressa.","photo-1514432324607-a09d9b4aefdd"],
    ["Americano","cafes","R$ 10","CLÁSSICO","Espresso alongado com água quente. Leve no corpo, cheio de aroma.","photo-1509042239860-f550ce710b93"],
    ["Cappuccino","cafes","R$ 15","QUERIDINHO","Espresso, leite vaporizado e uma espuma cremosa com cacau por cima.","photo-1572442388796-11668a67e53d"],
    ["Latte","cafes","R$ 16","LEVINHO","Espresso com leite aveludado. Vai bem com conversa que demora.","photo-1461023058943-07fcbe16d735"],
    ["Mocha","cafes","R$ 17","CHOCOLATE","Chocolate intenso, espresso e leite vaporizado numa xícara só.","photo-1578314675249-a6910f80cc4e"],
    ["Café coado","cafes","R$ 12","NO FILTRO","Coado na hora. Pergunte qual origem está no filtro hoje.","photo-1495474472287-4d71bcdd2085"],
    ["V60 da estação","especiais","R$ 18","ORIGEM BRASIL","Método filtrado, corpo delicado e notas que mudam com a safra.","photo-1498804103079-a6351b050096"],
    ["Prensa francesa","especiais","R$ 19","ENCORPADO","Extração generosa e aromática. Bom para dividir — ou guardar só para você.","photo-1442512595331-e89e73853f31"],
    ["Cold brew","especiais","R$ 16","GELADO","Extraído a frio por horas, servido geladinho e naturalmente doce.","photo-1461023058943-07fcbe16d735"],
    ["Brownie de casquinha","doces","R$ 14","CHOCOLATE","Chocolate intenso, centro macio e uma pitada de flor de sal.","photo-1606313564200-e75d5e30476c"],
    ["Cookie artesanal","doces","R$ 12","FEITO AQUI","Casquinha dourada, chocolate meio amargo e miolo ainda macio.","photo-1499636136210-6f4ee915583e"],
    ["Croissant amanteigado","doces","R$ 13","DA FORNADA","Folhado em camadas, assado por aqui toda manhã.","photo-1555507036-ab1f4038808a"],
    ["Bolo do dia","doces","R$ 14","SAZONAL","A receita muda com a estação. Pergunte qual acabou de sair.","photo-1578985545062-69928b1d9587"],
    ["Cheesecake da casa","doces","R$ 18","DA CASA","Recheio cremoso, base crocante e calda de fruta da estação.","photo-1533134242443-d4fd215305ad"],
    ["Pão de queijo","salgados","R$ 8","QUENTINHO","Casquinha crocante, miolo macio e queijo de verdade.","images/pao-de-queijo.png"],
    ["Sanduíche da horta","salgados","R$ 24","ALMOÇO","Pão artesanal, queijo meia cura, folhas e tomate assado.","photo-1528735602780-2552fd46c7af"],
    ["Toast de cogumelos","salgados","R$ 22","VEGETARIANO","Pão de fermentação natural, cogumelos salteados e ervas frescas.","photo-1525351484163-7529414344d8"],
    ["Croissant recheado","salgados","R$ 20","SALGADO","Presunto, queijo derretido e croissant quentinho saindo do forno.","https://img.hellofresh.com/f_auto%2Cfl_lossy%2Ch_640%2Cq_auto%2Cw_1200/hellofresh_s3/image/645af756cd93ab51c00178bc-15c2ff16.jpg"]
  ];

  const imageUrl = (id, width = 720) =>
    id.startsWith("https://") || id.startsWith("images/") ? id : "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + width + "&q=82";

  const productGrid = document.querySelector("#product-grid");
  if (productGrid) {
    const search = document.querySelector("#product-search");
    const filterButtons = [...document.querySelectorAll("[data-filter]")];
    const clearButton = document.querySelector("#clear-filters");
    const emptyClear = document.querySelector("#empty-clear");
    const emptyState = document.querySelector("#empty-state");
    const resultsCount = document.querySelector(".results-count");
    const modal = document.querySelector("#product-modal");
    const modalImage = modal.querySelector(".modal-image");
    const modalTitle = modal.querySelector("#modal-title");
    let activeCategory = "todos";
    let returnFocus = null;

    const renderProducts = () => {
      const query = search.value.trim().toLocaleLowerCase("pt-BR");
      const visible = products.filter((product) => {
        const categoryMatches = activeCategory === "todos" || product[1] === activeCategory;
        const textMatches = product.slice(0, 5).join(" ").toLocaleLowerCase("pt-BR").includes(query);
        return categoryMatches && textMatches;
      });

      productGrid.innerHTML = visible.map((product) => {
        const number = String(products.indexOf(product) + 1).padStart(2, "0");
        const category = { cafes: "CAFÉS", especiais: "MÉTODOS", doces: "DOCES", salgados: "SALGADOS" }[product[1]];
        return '<button class="product-card" type="button" data-product="' + product[0] + '">' +
          '<span class="product-image"><img src="' + imageUrl(product[5]) + '" alt="' + product[0] + '" loading="lazy">' +
          '<span class="product-tag">' + product[3] + '</span><span class="product-number">' + number + '</span></span>' +
          '<span class="product-card-copy"><span class="product-category">' + category + '</span>' +
          '<span class="product-name">' + product[0] + '</span><span class="product-description">' + product[4] + '</span>' +
          '<span class="product-price">' + product[2] + ' <small>ILUSTRATIVO</small></span></span><span class="product-arrow" aria-hidden="true">↗</span></button>';
      }).join("");

      emptyState.hidden = visible.length > 0;
      resultsCount.textContent = visible.length + (visible.length === 1 ? " produto" : " produtos") + " no cardápio";
    };

    const resetFilters = () => {
      activeCategory = "todos";
      search.value = "";
      filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === "todos")));
      renderProducts();
      search.focus();
    };

    filterButtons.forEach((button) => button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderProducts();
    }));
    search.addEventListener("input", renderProducts);
    clearButton.addEventListener("click", resetFilters);
    emptyClear.addEventListener("click", resetFilters);

    productGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-product]");
      if (!card) return;
      const product = products.find((item) => item[0] === card.dataset.product);
      if (!product) return;
      returnFocus = card;
      modalImage.src = imageUrl(product[5], 1400);
      modalImage.alt = product[0];
      modalTitle.textContent = product[0];
      modal.querySelector(".modal-category").textContent = product[3];
      modal.querySelector(".modal-description").textContent = product[4];
      modal.querySelector(".modal-price").textContent = product[2];
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modal.querySelector(".modal-close").focus();
    });

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      modalImage.removeAttribute("src");
      if (returnFocus) returnFocus.focus();
    };
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "Tab") {
        event.preventDefault();
        modal.querySelector(".modal-close").focus();
      }
    });
    renderProducts();
  }

  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.querySelector(".lightbox");
  if (galleryItems.length && lightbox) {
    const image = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".gallery-prev");
    const nextButton = lightbox.querySelector(".gallery-next");
    const counter = lightbox.querySelector(".gallery-counter");
    let activeImage = 0;
    let lastFocusedElement = null;

    const showImage = (index) => {
      activeImage = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[activeImage];
      image.src = item.dataset.full;
      image.alt = item.querySelector("img").alt;
      counter.textContent = String(activeImage + 1).padStart(2, "0") + " / " + String(galleryItems.length).padStart(2, "0");
    };
    const openGallery = (index) => {
      lastFocusedElement = document.activeElement;
      showImage(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      closeButton.focus();
    };
    const closeGallery = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      image.removeAttribute("src");
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    galleryItems.forEach((item, index) => item.addEventListener("click", () => openGallery(index)));
    previousButton.addEventListener("click", () => showImage(activeImage - 1));
    nextButton.addEventListener("click", () => showImage(activeImage + 1));
    closeButton.addEventListener("click", closeGallery);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeGallery();
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showImage(activeImage - 1);
      if (event.key === "ArrowRight") showImage(activeImage + 1);
    });
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const feedback = contactForm.querySelector(".form-feedback");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      feedback.className = "form-feedback";
      if (!contactForm.reportValidity()) {
        feedback.textContent = "Dá uma conferida nos campos destacados e tenta de novo.";
        feedback.classList.add("error");
        return;
      }
      feedback.textContent = "Obrigada pela mensagem! Este formulário é demonstrativo e não envia dados. Use os canais ilustrativos ao lado para contato.";
      contactForm.reset();
    });
  }

  const animatedItems = document.querySelectorAll(".food-card, .content-split, .value-grid article, .gallery-item");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animatedItems.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
});
