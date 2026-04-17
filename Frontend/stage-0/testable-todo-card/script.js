const todo = {
	title: "Finish SaaS landing page",
	description:
		"Build hero section, pricing, and footer with a long description to trigger collapse behavior properly.",
	priority: "Low",
	status: "Pending",
	dueDate: new Date("2026-02-18T12:00:00Z"),
	completed: false,
};

let isExpanded = false;
let interval;

const limit = 80;

const titleEl = document.getElementById("title");
const descEl = document.getElementById("description");
const expandBtn = document.getElementById("expandBtn");
const priorityIndicator = document.getElementById("priorityIndicator");
const priorityText = document.getElementById("priorityText");
const statusDisplay = document.getElementById("statusDisplay");
const statusControl = document.getElementById("statusControl");
const checkbox = document.getElementById("checkbox");
const timeEl = document.getElementById("timeRemaining");
const overdueEl = document.getElementById("overdue");
const dueDateEl = document.getElementById("dueDate");

const editForm = document.getElementById("editForm");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editBtn = document.getElementById("editBtn");
const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editPriority = document.getElementById("editPriority");
const editDate = document.getElementById("editDate");
const editAndDeleteButtons = document.getElementById("editAndDeleteButtons");

function formatTime() {
	if (todo.completed) return "Completed";

	const diff = todo.dueDate - new Date();
	const abs = Math.abs(diff);

	const mins = Math.floor(abs / 60000);
	const hrs = Math.floor(abs / 3600000);
	const days = Math.floor(abs / 86400000);

	if (diff < 0) {
		overdueEl.classList.remove("hidden");
		if (days) return `Overdue by ${days} day(s)`;
		if (hrs) return `Overdue by ${hrs} hour(s)`;
		return `Overdue by ${mins} minute(s)`;
	}

	overdueEl.classList.add("hidden");
	if (days) return `Due in ${days} day(s)`;
	if (hrs) return `Due in ${hrs} hour(s)`;
	return `Due in ${mins} minute(s)`;
}

function render() {
	titleEl.textContent = todo.title;

	//collapses if description exceeds limit
	const shouldCollapse = todo.description.length > limit;
	if (!isExpanded && shouldCollapse) {
		descEl.textContent = todo.description.slice(0, limit) + "...";
		expandBtn.style.display = "block";
	} else {
		descEl.textContent = todo.description;
		expandBtn.style.display = shouldCollapse ? "block" : "none";
	}

	expandBtn.textContent = isExpanded ? "Collapse" : "Expand";
	expandBtn.setAttribute("aria-expanded", isExpanded);

	//smooth transition for expand/collapse
	const collapsible = document.getElementById("collapsible");
	if (collapsible) {
		collapsible.classList.toggle("expanded", isExpanded);
	}

	priorityText.textContent = todo.priority;
	priorityIndicator.className = "";
	priorityIndicator.classList.add(todo.priority.toLowerCase());

	statusDisplay.textContent = todo.status;
	statusControl.value = todo.status;

	checkbox.checked = todo.completed;

	dueDateEl.textContent = "Due " + todo.dueDate.toDateString();
	timeEl.textContent = formatTime();

	// visual state changes
	titleEl.classList.toggle("done", todo.completed);
	document
		.querySelector(".card")
		.classList.toggle("in-progress", todo.status === "In Progress");
	document
		.querySelector(".card")
		.classList.toggle("high-priority", todo.priority === "High");
	document
		.querySelector(".card")
		.classList.toggle("overdue", todo.dueDate < new Date() && !todo.completed);
}

expandBtn.onclick = () => {
	isExpanded = !isExpanded;
	expandBtn.setAttribute("aria-expanded", isExpanded);
	render();
};

checkbox.onchange = () => {
	todo.completed = checkbox.checked;
	todo.status = checkbox.checked ? "Done" : "Pending";
	render();
};

statusControl.onchange = () => {
	todo.status = statusControl.value;
	todo.completed = todo.status === "Done";
	render();
};

editBtn.onclick = () => {
	// Hide normal elements
	titleEl.classList.add("hidden");
	descEl.parentElement.classList.add("hidden");
	expandBtn.classList.add("hidden");
	document.querySelector(".row").classList.add("hidden");
	statusDisplay.classList.add("hidden");
	dueDateEl.classList.add("hidden");
	timeEl.classList.add("hidden");
	overdueEl.classList.add("hidden");
	checkbox.parentElement.classList.add("hidden");
	document.querySelector(".tags").classList.add("hidden");
	editAndDeleteButtons.classList.add("hidden");

	editForm.classList.remove("hidden");

	// Populate form
	editTitle.value = todo.title;
	editDesc.value = todo.description;
	editPriority.value = todo.priority;
	editDate.value = todo.dueDate.toISOString().slice(0, 16);

	// focusable input
	editTitle.focus();
};

// focus trap for edit form
editForm.addEventListener("keydown", (e) => {
	if (e.key === "Tab") {
		const focusableElements = editForm.querySelectorAll(
			"input, textarea, select, button",
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (e.shiftKey) {
			if (document.activeElement === firstElement) {
				lastElement.focus();
				e.preventDefault();
			}
		} else {
			if (document.activeElement === lastElement) {
				firstElement.focus();
				e.preventDefault();
			}
		}
	}

	if (e.key === "Escape") {
		exitEditMode();
	}
});

saveBtn.onclick = () => {
	if (!editTitle.value.trim() || !editDesc.value.trim()) {
		alert("Title and description cannot be empty");
		return;
	}

	todo.title = editTitle.value;
	todo.description = editDesc.value;
	todo.priority = editPriority.value;
	todo.dueDate = new Date(editDate.value);

	isExpanded = false;
	exitEditMode();
	render();
};

cancelBtn.onclick = () => {
	exitEditMode();
};

function exitEditMode() {
	// shows normal elements
	titleEl.classList.remove("hidden");
	descEl.parentElement.classList.remove("hidden");
	expandBtn.classList.remove("hidden");
	document.querySelector(".row").classList.remove("hidden");
	statusDisplay.classList.remove("hidden");
	dueDateEl.classList.remove("hidden");
	timeEl.classList.remove("hidden");
	if (todo.dueDate < new Date() && !todo.completed) {
		overdueEl.classList.remove("hidden");
	}
	checkbox.parentElement.classList.remove("hidden");
	document.querySelector(".tags").classList.remove("hidden");
	editAndDeleteButtons.classList.remove("hidden");

	editForm.classList.add("hidden");

	//eturns focus to edit button
	editBtn.focus();
}

const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) {
	deleteBtn.onclick = () => {
		if (confirm("Are you sure you want to delete this task?")) {
			clearInterval(interval);
			document.querySelector("article").style.opacity = "0.5";
			document.querySelector("article").style.pointerEvents = "none";
			alert("Task deleted successfully!");
		}
	};
}

interval = setInterval(render, 30000);

render();
