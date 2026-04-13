const dueDate = new Date("2026-02-18T12:00:00Z");

const timeEl = document.getElementById("timeRemaining");
const toggle = document.getElementById("toggle");
const title = document.getElementById("todo-title");
const status = document.getElementById("status");

function formatDate(date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function calculateTimeRemaining() {
	const now = new Date();
	const diff = dueDate - now;
	const abs = Math.abs(diff);

	const minutes = Math.floor(abs / (1000 * 60));
	const hours = Math.floor(abs / (1000 * 60 * 60));
	const days = Math.floor(abs / (1000 * 60 * 60 * 24));

	if (abs < 60000) return "Due now!";

	if (diff > 0) {
		if (days >= 2) return `Due in ${days} days`;
		if (days === 1) return "Due tomorrow";
		if (hours >= 1) return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
		return `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
	}

	if (days >= 1) return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
	if (hours >= 1) return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
	return `Overdue by ${minutes} minute${minutes > 1 ? "s" : ""}`;
}

function updateTime() {
	timeEl.textContent = calculateTimeRemaining();
}

updateTime();

setInterval(updateTime, 30000);

toggle.addEventListener("change", () => {
	const completed = toggle.checked;

	if (completed) {
		title.classList.add("completed");
		status.textContent = "Done";
		status.classList.remove("status");
		status.classList.add("done");
		status.setAttribute("aria-label", "Status: Done");
	} else {
		title.classList.remove("completed");
		status.textContent = "In Progress";
		status.classList.remove("done");
		status.classList.add("status");
		status.setAttribute("aria-label", "Status: In Progress");
	}
});

// buttons
document.getElementById("editBtn").addEventListener("click", () => {
	alert("edit clicked");
});

document.getElementById("deleteBtn").addEventListener("click", () => {
	alert("Delete clicked");
});
