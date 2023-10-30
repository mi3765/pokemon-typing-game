"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Start } from "../pages/Start";
import { GamePlay } from "@/pages/GamePlay";
import "../styles/Pages.scss";

export default function Home() {
	const [isGamePlay, setIsGamePlay] = useState(false);
	const openGamePlay = () => {
		setIsGamePlay(true);
	};
	const closeGamePlay = () => {
		setIsGamePlay(false);
	};

	return (
		<div className="container">
			<div className="start-display">
				<Start />
				<button onClick={openGamePlay}>START</button>
			</div>
			{isGamePlay && <GamePlay onClose={closeGamePlay}></GamePlay>}
		</div>
	);
}
