"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";
import { API_PLAYS, GAMES } from "@/constants";
import { CreatePlayForm } from "./CreatePlayForm";
import type { CreatePlayFormData, PlayerEntry } from "./types";

/**
 * Get today's date in YYYY-MM-DD format.
 */
function getTodayDate(): string {
	return new Date().toISOString().split("T")[0];
}

/**
 * Generate a unique ID for player entries.
 */
function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

/**
 * Create a new empty player entry.
 */
function createPlayerEntry(name = ""): PlayerEntry {
	return { id: generateId(), name };
}

/**
 * Container component for the create play page.
 * Handles all state and business logic.
 */
export function CreatePlayPage() {
	const router = useRouter();
	const [form, setForm] = useState<CreatePlayFormData>({
		game: "",
		date: getTodayDate(),
		players: [createPlayerEntry(), createPlayerEntry()],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGameChange = (value: string) => {
		setForm((prev) => ({ ...prev, game: value }));
	};

	const handleDateChange = (value: string) => {
		setForm((prev) => ({ ...prev, date: value }));
	};

	const handlePlayerNameChange = (id: string, value: string) => {
		setForm((prev) => ({
			...prev,
			players: prev.players.map((p) =>
				p.id === id ? { ...p, name: value } : p,
			),
		}));
	};

	const handlePlayerScoreChange = (id: string, value: string) => {
		const score = value === "" ? undefined : Number(value);
		setForm((prev) => ({
			...prev,
			players: prev.players.map((p) => (p.id === id ? { ...p, score } : p)),
		}));
	};

	const handleAddPlayer = () => {
		setForm((prev) => ({
			...prev,
			players: [...prev.players, createPlayerEntry()],
		}));
	};

	const handleRemovePlayer = (id: string) => {
		if (form.players.length <= 2) return;
		setForm((prev) => ({
			...prev,
			players: prev.players.filter((p) => p.id !== id),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/plays", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date: form.date,
					game: form.game,
					players: form.players
						.filter((p) => p.name.trim() !== "")
						.map((p) => ({ name: p.name, score: p.score })),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to save play");
			}

			await mutate(API_PLAYS);
			router.push("/plays");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setIsSubmitting(false);
		}
	};

	const isValid =
		form.game.trim() !== "" &&
		form.players.filter((p) => p.name.trim() !== "").length >= 2;

	return (
		<CreatePlayForm
			game={form.game}
			date={form.date}
			players={form.players}
			games={GAMES}
			isSubmitting={isSubmitting}
			isValid={isValid}
			error={error}
			onGameChange={handleGameChange}
			onDateChange={handleDateChange}
			onPlayerNameChange={handlePlayerNameChange}
			onPlayerScoreChange={handlePlayerScoreChange}
			onAddPlayer={handleAddPlayer}
			onRemovePlayer={handleRemovePlayer}
			onSubmit={handleSubmit}
		/>
	);
}
