"use client";
import "../styles/GamePlay.scss";
import { getPokemonData } from "../utils/api";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

interface Props {
	children?: string;
	onClose?: () => void;
}

export const GamePlay: React.FC<Props> = ({ children, onClose }) => {
	const [pokemonName, setPokemonName] = useState<string>("");
	const [pokemonImage, setPokemonImage] = useState<string | null>(null);
	const [inputElement, setInputElement] = useState<string>("");
	const [correctValue, setCorrectValue] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getPokemonData();
				setPokemonName(data.name);
				console.log(data);
				setPokemonImage(data.sprites.front_default);

				// 正解の文字を span 要素の配列として生成
				const correctValueArray = data.name.split("").map((char, index) => {
					return <span key={index}>{char}</span>;
				});

				setCorrectValue(correctValueArray);
				console.log(correctValueArray);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);

	const judgeTypes = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputElement(e.target.value);

		const arrayValue = e.target.value.split("");
		console.log(arrayValue);
		arrayValue.map((char: string, index: number) => {
			if (arrayValue[index] === "") {
				console.log("null");
			} else if (correctValue[index].props.children === arrayValue[index]) {
				console.log("OK");
				// 正解の文字のデザインを変える処理をここに追加
			} else {
				console.log("No");
				// 間違った文字のデザインを変える処理をここに追加
			}
		});
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<div className="pokemon-card">
					<CloseIcon
						onClick={onClose}
						className="close-button"
						sx={{ fontSize: 50 }}
					/>
					<div className="display">{correctValue}</div>
					<img src={pokemonImage} alt="" />
					<input type="text" onChange={judgeTypes} value={inputElement} />
				</div>
			</div>
		</div>
	);
};
