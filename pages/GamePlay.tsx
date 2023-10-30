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
	const [correctCount, setCorrectCount] = useState<number>(0);
	const [pokemonNameLength, setPokemonNameLength] = useState<number>(0);
	const [timer, setTimer] = useState<number>(30);
	const [missCount, setMissCount] = useState<number>(0);
	const [correctPokemons, setCorrectPokemons] = useState<number>(0);
	const [errorText, setErrorText] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getPokemonData();
				setPokemonName(data.name);
				setPokemonImage(data.sprites.front_default);
				setPokemonNameLength(data.name.length);
				setCorrectCount(0);
				setTimer(30);
				setInputElement("");
				// 正解の文字を span 要素の配列として生成
				const correctValueArray = data.name.split("").map((char, index) => {
					return <span key={index}>{char}</span>;
				});

				setCorrectValue(correctValueArray);
			} catch (error) {
				console.error(error);
			}
		};
		if (timer === 0 || pokemonNameLength === correctCount) {
			// タイマーが0またはゲームクリア条件を満たす場合のみデータを再取得
			fetchData();
		}
	}, [timer == 0 || pokemonNameLength == correctCount]);

	useEffect(() => {
		const correctLetter = document.querySelector(".display");
		if (correctLetter) {
			const childElems = correctLetter.children;
			for (let i = 0; i < childElems.length; i++) {
				childElems[i].classList.remove("correct");
				childElems[i].classList.remove("incorrect");
			}
		}
	}, [correctValue]);

	useEffect(() => {
		if (timer === -2) {
			// ゲームオーバーの処理などをここに追加
			// 色々リセット
			setTimeout(() => {
				setTimer(30);
			}, 1000);
			setMissCount((prev) => prev + 1);
		}
		if (missCount >= 5) {
			console.log("GAME OVER");
		}
	}, [timer]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const judgeTypes = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputElement(e.target.value);

		const arrayValue = e.target.value.split("");
		arrayValue.map((char: string, index: number) => {
			const correctLetter = document.querySelector(".display");
			const childElems = correctLetter?.children;
			if (index >= correctValue.length) {
				index = 0;
				setErrorText("入力文字数が正解の文字数を超えています");
			} else {
				setErrorText("");
			}

			// TODO: indexの値を超えて文字を入力された時の処理を追加する
			if (arrayValue[index] === null) {
				childElems[index].classList.remove("correct");
				childElems[index].classList.remove("incorrect");
			} else if (correctValue[index].props.children === arrayValue[index]) {
				setCorrectCount(correctCount + 1);
				console.log(correctValue[index].props.children);
				console.log(arrayValue[index]);
				childElems[index].classList.add("correct");
				childElems[index].classList.remove("incorrect");
				console.log(pokemonNameLength);
				console.log(correctCount);
				if (correctCount + 1 === pokemonNameLength) {
					// 音ならす
					// 色々リセット
					setCorrectPokemons(correctPokemons + 1);
				}
			} else {
				// 間違った文字のデザインを変える処理をここに追加
				childElems[index].classList.remove("correct");
				childElems[index].classList.add("incorrect");
			}
		});
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<CloseIcon
					onClick={onClose}
					className="close-button"
					sx={{ fontSize: 50 }}
				/>
				<div>{correctPokemons}</div>
				<div className="timer">{timer}</div>
				<div className="pokemon-card">
					<div className="display">{correctValue}</div>
					<img src={pokemonImage} alt="" />
					<input
						type="text"
						onChange={judgeTypes}
						value={inputElement}
						autoFocus
					/>
					{errorText && <div className="error-message">{errorText}</div>}
				</div>
			</div>
		</div>
	);
};
