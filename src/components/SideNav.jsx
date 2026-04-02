import { first151Pokemon, getFullPokedexNumber } from "../utils";

function SideNav() {
    return (
        <nav>
            <div className={"header"}>
                <h1 className="text-gradient">Pokedex</h1>
            </div>
            <input/>
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button className={'nav-card'} key={pokemonIndex}>
                        <p>{getFullPokedexNumber(pokemonIndex)}</p>
                        {pokemon}
                    </button>
                );
            })}
        </nav>
    );
}
export default SideNav