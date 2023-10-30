import { PokemonClient } from "pokenode-ts";

const api = new PokemonClient();
const randomNum = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getPokemonData = async () => {
	try {
		const data = await api.getPokemonById(randomNum(1, 898));
		return data;
	} catch (error) {
		throw error;
	}
};
