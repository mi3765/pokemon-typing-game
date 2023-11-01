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
	const [pokemonImage, setPokemonImage] = useState<string | undefined>(
		undefined
	);
	const [inputElement, setInputElement] = useState<string>("");
	const [correctValue, setCorrectValue] = useState<JSX.Element[]>([]);
	const [correctCount, setCorrectCount] = useState<number>(0);
	const [pokemonNameLength, setPokemonNameLength] = useState<number>(0);
	const [timer, setTimer] = useState<number>(30);
	const [missCount, setMissCount] = useState<number>(0);
	const [correctPokemons, setCorrectPokemons] = useState<number>(0);
	const [errorText, setErrorText] = useState<string>("");

	// 新しい関数: 問題を更新するための関数
	const updateQuestion = async () => {
		try {
			const data = await getPokemonData();
			console.log(data);
			// API参照のタイミングで色々初期化
			setPokemonName(data.name);
			setPokemonImage(data.sprites.front_default || undefined);
			setPokemonNameLength(data.name.length);
			setCorrectCount(0);
			setTimer(30);
			setInputElement("");
			// 正解の文字を <span> 要素の配列として生成
			// 1文字ずつ装飾するため
			const correctValueArray = data.name.split("").map((char, index) => {
				return <span key={index}>{char}</span>;
			});

			setCorrectValue(correctValueArray);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getPokemonData();
				console.log(data);
				// API参照のタイミングで色々初期化
				setPokemonName(data.name);
				setPokemonImage(data.sprites.front_default || undefined);
				setPokemonNameLength(data.name.length);
				setCorrectCount(0);
				setTimer(30);
				setInputElement("");
				// 正解の文字を <span> 要素の配列として生成
				// 1文字ずつ装飾するため
				const correctValueArray = data.name.split("").map((char, index) => {
					return <span key={index}>{char}</span>;
				});

				setCorrectValue(correctValueArray);
			} catch (error) {
				console.error(error);
			}
		};
		if (timer <= 0 || pokemonNameLength === correctCount) {
			// 制限時間が0秒以下または全文字タイピング正答の条件を追加
			// 問題を更新
			updateQuestion();
		}
	}, [timer, correctCount, pokemonNameLength]);

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
			console.log("MISS");
		}
		if (missCount >= 5) {
			console.log("GAME OVER");
		}
	}, [timer, missCount]);

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
			console.log(childElems);
			if (index >= correctValue.length) {
				index = 0;
				setErrorText("入力文字数が正解の文字数を超えています");
			} else {
				setErrorText("");
			}

			if (childElems && arrayValue[index] === null) {
				childElems[index].classList.remove("correct");
				childElems[index].classList.remove("incorrect");
			} else if (
				childElems &&
				correctValue[index]?.props.children === arrayValue[index]
			) {
				setCorrectCount(correctCount + 1);
				childElems[index].classList.add("correct");
				childElems[index].classList.remove("incorrect");
				if (correctCount + 1 === pokemonNameLength) {
					// 音ならす
					setCorrectPokemons(correctPokemons + 1);
				}
			} else if (childElems) {
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
					{Array.isArray(correctValue) ? (
						<div className="display">
							{correctValue.map((element, index) => (
								<span key={index}>{element}</span>
							))}
						</div>
					) : null}
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
