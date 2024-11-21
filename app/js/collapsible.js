document.addEventListener("DOMContentLoaded", function () {
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach((collapsible) => {
        collapsible.addEventListener("click", function () {
            this.classList.toggle("active");

            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.opacity = 0;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = 1;
            }
        });
    });
});
// Fetch API req
// Fetch API req
async function getData() {
    try{
        const response = await fetch("http://localhost:8080/data.json",{cache:"no-store"});
        if (!response.ok) {
            throw new Error('Помилка при завантаженні даних');
        }
        const json = await response.json();
        renderData(json,"Fetch API");
    }catch(error){
        console.error('Помилка під час отримання даних:', error);
    }
}

getData();

function renderData(data) {
    const dataContainer = document.getElementById("data-container");

    // Перевіряємо, чи є в даних досвід
    if (data.experience && Array.isArray(data.experience)) {
        data.experience.forEach((item) => {
            const div = document.createElement("div");

            // Заголовок
            const title = document.createElement("h3");
            title.className = "section-title";
            title.textContent = `Title: ${item.title}`;
            div.appendChild(title);

            // Дати
            const dates = document.createElement("p");
            dates.textContent = `Period: ${item.start_date} - ${item.end_date}`;
            div.appendChild(dates);

            dataContainer.appendChild(div);
        });
    } else {
        dataContainer.textContent = "No experience data found.";
    }
}

