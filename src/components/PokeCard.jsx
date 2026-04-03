import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from '../utils';
import TypeCard from "./TypeCard";
import Modal from "./Modal";
export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null)
    const { name, height, abilities, stats, types, moves, sprites } = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    useEffect(() => {
        // Si on charge déjà ou si le stockage n'est pas dispo, on sort
        if (loading || !localStorage) { return; }

        // 1. Vérification du cache
        let cache = {};
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon]);
            return;
        }

         

        // 2. Si pas dans le cache, on fetch l'API
     async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                
                const res = await fetch(finalUrl);
                const pokemonData = await res.json();
                
                setData(pokemonData);
                
                // Sauvegarde dans le cache
                cache[selectedPokemon] = pokemonData;
                localStorage.setItem('pokedex', JSON.stringify(cache));
                
                console.log('Fetched pokemon data from API');
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData();
    }, [selectedPokemon]); // Se relance à chaque changement de pokemon

    // Affichage pendant le chargement
    if (loading || !data) {
        return (
            <div className="poke-card">
                <h4>Loading...</h4>
            </div>
        );
    }
async function fetchMoveData(moveName, moveUrl) {
    if (loading || !localStorage) return;

    let cache = {};
    if (localStorage.getItem('pokemon-moves')) {
        cache = JSON.parse(localStorage.getItem('pokemon-moves'));
    }

    if (moveName in cache) {
        setSkill(cache[moveName]);
        return;
    }

    try {
        const res = await fetch(moveUrl);
        const moveData = await res.json();
        
        // On extrait la description en français (ou anglais selon votre choix)
        const description = moveData?.effect_entries?.find(val => val.language.name === 'en')?.effect 
                            || "No description available";

        const skillData = {
            name: moveName,
            description: description
        };

        setSkill(skillData);
        cache[moveName] = skillData;
        localStorage.setItem('pokemon-moves', JSON.stringify(cache));
    } catch (err) {
        console.log(err);
    }
}
    // Affichage final
    return (
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
                 )}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            
            <div className='type-container'>
                {types?.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    );
                })}
            </div>

            <img 
                className='default-img' 
                src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} 
                alt={`${name}-large-img`} 
            />
             <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}` } loading="lazy" />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move' 
                            key={moveIndex} 
                            onClick={() => {
                     fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
    }}>
    <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
</button>
                    )
                })}
            </div>
        </div>
    );
}