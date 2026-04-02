import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from '../utils';
import TypeCard from "./TypeCard";

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Extraction des données (avec valeurs par défaut pour éviter les erreurs)
    const { name, types } = data || {};

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

    // Affichage final
    return (
        <div className="poke-card">
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
        </div>
    );
}