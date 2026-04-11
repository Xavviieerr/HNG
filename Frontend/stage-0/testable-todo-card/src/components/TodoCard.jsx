import React, { useState, useEffect } from "react";

function TodoCard() {
	const [timeRemaining, setTimeRemaining] = useState("calculating...");

	const [todo, setTodo] = useState({
		title: "Finish SaaS landing page",
		description: "Build hero section, pricing, and footer",
		priority: "Low",
		dueDate: new Date("2026-02-18T12:00:00"),
		status: "In Progress",
		tags: ["work", "urgent", "design"],
		completed: false,
	});

	const formatDate = (date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	function PriorityBadge(priority) {
		switch (priority) {
			case "High":
				return "High 🔴";
			case "Medium":
				return "Medium 🟠";
			case "Low":
				return "Low 🟢";
			default:
				return "Unknown";
		}
	}

	function calculateTimeRemaining(dueDate) {
		const now = new Date();
		const due = new Date(dueDate);

		if (isNaN(due.getTime())) {
			return "Invalid date";
		}

		const diff = due - now;
		const absDiff = Math.abs(diff);

		const minutes = Math.floor(absDiff / (1000 * 60));
		const hours = Math.floor(absDiff / (1000 * 60 * 60));
		const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

		if (absDiff < 60 * 1000) {
			return "Due now!";
		}

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

	function handleToggle() {
		setTodo((prev) => ({ ...prev, completed: !prev.completed }));
	}

	function deleteTodo() {
		alert("Todo deleted!");
	}

	function editTodo() {
		alert("Todo edited!");
	}

	useEffect(() => {
		setTimeRemaining(calculateTimeRemaining(todo.dueDate));

		const interval = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining(todo.dueDate));
		}, 30000);

		return () => clearInterval(interval);
	}, [todo.dueDate]);

	return (
		<article
			data-testid="test-todo-card"
			className="w-full max-w-[500px] mx-auto p-5 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200"
		>
			<div className="w-full overflow-hidden rounded-xl shadow-lg ring p-1">
				<img
					src="https://ntvb.tmsimg.com/assets/p31942675_v_h10_aa.jpg?w=1280&h=720"
					alt="A little something"
					className="w-full h-[300px] object-cover rounded-lg"
				/>
			</div>
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h3
					data-testid="test-todo-title"
					className={`text-lg font-semibold text-gray-900 ${
						todo.completed ? "line-through opacity-60" : ""
					}`}
				>
					{todo.title}
				</h3>

				<p
					data-testid="test-todo-description"
					className="text-sm text-gray-600 break-words"
				>
					{todo.description}
				</p>
			</div>

			{/* Priority + Status */}
			<div className="flex items-center justify-between flex-wrap gap-2">
				<span
					data-testid="test-todo-priority"
					aria-label={`Priority: ${todo.priority}`}
					className={`text-xs px-2 py-1 rounded-full font-medium ${
						todo.priority === "High"
							? "bg-red-100 text-red-600"
							: todo.priority === "Medium"
								? "bg-orange-100 text-orange-600"
								: "bg-green-100 text-green-600"
					}`}
				>
					{PriorityBadge(todo.priority)}
				</span>

				<span
					data-testid="test-todo-status"
					aria-label={`Status: ${todo.completed ? "Done" : todo.status}`}
					className={`text-xs px-2 py-1 rounded-full font-medium ${
						todo.completed
							? "bg-gray-200 text-gray-700"
							: "bg-blue-100 text-blue-600"
					}`}
				>
					{todo.completed ? "Done" : todo.status}
				</span>
			</div>

			{/* Dates */}
			<div className="flex flex-col text-sm gap-1">
				<time
					data-testid="test-todo-due-date"
					dateTime={todo.dueDate.toISOString()}
					className="text-gray-500"
				>
					Due: {formatDate(todo.dueDate)}
				</time>

				<time
					data-testid="test-todo-time-remaining"
					aria-live="polite"
					className="font-medium text-gray-800"
				>
					{timeRemaining}
				</time>
			</div>

			{/* Checkbox */}
			<label className="flex items-center gap-2 text-sm cursor-pointer">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={handleToggle}
					data-testid="test-todo-complete-toggle"
					className="w-4 h-4 accent-blue-500"
				/>
				<span className="text-gray-700">Mark as complete</span>
			</label>

			{/* Tags */}
			<ul
				role="list"
				data-testid="test-todo-tags"
				className="flex flex-wrap gap-2"
			>
				{todo.tags.map((tag) => (
					<li
						key={tag}
						data-testid={`test-todo-tag-${tag}`}
						className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
					>
						#{tag}
					</li>
				))}
			</ul>

			{/* Buttons */}
			<div className="flex gap-2 flex-wrap pt-2">
				<button
					data-testid="test-todo-edit-button"
					onClick={editTodo}
					className="flex-1 px-3 py-2 text-sm rounded-lg bg-blue-400 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
				>
					Edit
				</button>

				<button
					data-testid="test-todo-delete-button"
					onClick={deleteTodo}
					className="flex-1 px-3 py-2 text-sm rounded-lg bg-red-400 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
				>
					Delete
				</button>
			</div>
		</article>
	);
}

export default TodoCard;
