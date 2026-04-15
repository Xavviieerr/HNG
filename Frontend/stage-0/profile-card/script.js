const display = document.getElementById("epoch-display");
const btn = document.getElementById("update-btn");

function updateTime() {
	display.textContent = Date.now();
}

updateTime();

btn.addEventListener("click", updateTime);

setInterval(updateTime, 1000);
