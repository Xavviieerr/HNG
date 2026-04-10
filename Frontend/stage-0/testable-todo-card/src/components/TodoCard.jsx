import React, { useState, useEffect } from "react";

function TodoCard() {
	const [timeRemaining, setTimeRemaining] = useState("calculating...");

	const [todo, setTodo] = useState({
		title: "Finish SaaS landing page",
		description: "Build hero section, pricing, and footer",
		priority: "High",
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
				return "gray";
		}
	}

	function calculateTimeRemaining(dueDate) {
		const now = new Date();

		const due = new Date(dueDate);
		if (isNaN(due.getTime())) {
			return "Invalid date";
		}
		console.log(dueDate);

		const diff = due - now;
		const absDiff = Math.abs(diff);

		const minutes = Math.floor(absDiff / (1000 * 60));
		const hours = Math.floor(absDiff / (1000 * 60 * 60));
		const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

		// case now
		if (absDiff < 60 * 1000) {
			return "Due now!";
		}

		//futuer cases
		if (diff > 0) {
			if (days >= 2) {
				return `Due in ${days} days`;
			}

			if (days === 1) {
				return "Due tomorrow";
			}

			if (hours >= 1) {
				return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
			}

			return `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
		}

		//overdue cases
		if (days >= 1) {
			return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
		}

		if (hours >= 1) {
			return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
		}

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
		const interval = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining(todo.dueDate));
		}, 30000);

		return () => clearInterval(interval);
	}, [todo.dueDate]);

	return (
		<article
			data-testid="test-todo-card"
			className="ring w-full max-w-[500px] mx-auto p-4 flex flex-col gap-3 box-border"
		>
			{/* Title */}
			<h3
				data-testid="test-todo-title"
				className={`text-lg font-semibold ${
					todo.completed ? "line-through opacity-60" : ""
				}`}
			>
				{todo.title}
			</h3>

			{/* Description */}
			<p
				data-testid="test-todo-description"
				className="text-sm text-gray-600 break-words"
			>
				{todo.description}
			</p>

			{/* Priority */}
			<span data-testid="test-todo-priority" className="text-sm font-medium">
				{PriorityBadge(todo.priority)}
			</span>

			{/* Due date */}
			<time data-testid="test-todo-due-date" className="text-sm text-gray-500">
				Due: {formatDate(todo.dueDate)}
			</time>

			{/* Time remaining */}
			<time
				data-testid="test-todo-time-remaining"
				className="text-sm font-medium"
			>
				{timeRemaining}
			</time>

			{/* Status */}
			<div data-testid="test-todo-status" className="text-sm">
				Status: {todo.completed ? "Done" : todo.status}
			</div>

			{/* Checkbox */}
			<label className="flex items-center gap-2 text-sm cursor-pointer">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={handleToggle}
					data-testid="test-todo-complete-toggle"
					className="w-4 h-4"
				/>
				Mark as complete
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
						className="px-2 py-1 text-xs border rounded-md bg-gray-100"
					>
						{tag}
					</li>
				))}
			</ul>

			{/* Buttons */}
			<div className="flex gap-2 flex-wrap">
				<button
					data-testid="test-todo-edit-button"
					onClick={editTodo}
					className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
				>
					Edit
				</button>

				<button
					data-testid="test-todo-delete-button"
					onClick={deleteTodo}
					className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
				>
					Delete
				</button>
			</div>
		</article>
	);
}

export default TodoCard;
