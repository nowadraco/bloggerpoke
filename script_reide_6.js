document.addEventListener('DOMContentLoaded', async () => {
    const raidListElement = document.getElementById('raid-list');

    const pokemonDataUrl = "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_reide_shiny.json";
    const typeDataUrl = "https://raw.githubusercontent.com/nowadraco/bloggerpoke/main/src/data/gamemaster/tipos_poke.json";

    // Lista de Pokémon para pesquisar
    const userPokemonList = [
        "Shellder*",
        "Ducklett*",
        "Tatsugiri (Forma Curvada)",
        "Tatsugiri (Forma Pendular)",
        "Tatsugiri (Forma Estendida)",
        "Kingler",
        "Murkrow (shadow)*",
    ];

    // CP Multipliers (copiados da sua função Python)
    const cpms = {
        1: 0.094, 1.5: 0.1351374318, 2: 0.16639787, 2.5: 0.192650919, 3: 0.21573247,
        3.5: 0.2365726613, 4: 0.25572005, 4.5: 0.2735303812, 5: 0.29024988, 5.5: 0.3060573775,
        6: 0.3210876, 6.5: 0.3354450362, 7: 0.34921268, 7.5: 0.3624577511, 8: 0.3752356,
        8.5: 0.387592416, 9: 0.39956728, 9.5: 0.4111935514, 10: 0.4225, 10.5: 0.4329264091,
        11: 0.44310755, 11.5: 0.4530599591, 12: 0.4627984, 12.5: 0.472336093, 13: 0.48168495,
        13.5: 0.4908558003, 14: 0.49985844, 14.5: 0.508701765, 15: 0.51739395, 15.5: 0.5259425113,
        16: 0.5343543, 16.5: 0.5426357375, 17: 0.5507927, 17.5: 0.5588305862, 18: 0.5667545,
        18.5: 0.5745691333, 19: 0.5822789, 19.5: 0.5898879072, 20: 0.5974, 20.5: 0.6048236651,
        21: 0.6121573, 21.5: 0.6194041216, 22: 0.6265671, 22.5: 0.6336491432, 23: 0.64065295,
        23.5: 0.6475809666, 24: 0.65443563, 24.5: 0.6612192524, 25: 0.667934, 25.5: 0.6745818959,
        26: 0.6811649, 26.5: 0.6876849038, 27: 0.69414365, 27.5: 0.70054287, 28: 0.7068842,
        28.5: 0.7131691091, 29: 0.7193991, 29.5: 0.7255756136, 30: 0.7317, 30.5: 0.7347410093,
        31: 0.7377695, 31.5: 0.7407855938, 32: 0.74378943, 32.5: 0.7467812109, 33: 0.74976104,
        33.5: 0.7527290867, 34: 0.7556855, 34.5: 0.7586303683, 35: 0.76156384, 35.5: 0.7644860647,
        36: 0.76739717, 36.5: 0.7702972656, 37: 0.7731865, 37.5: 0.7760649616, 38: 0.77893275,
        38.5: 0.7817900548, 39: 0.784637, 39.5: 0.7874736075, 40: 0.7903, 40.5: 0.792803968,
        41: 0.79530001, 41.5: 0.797800015, 42: 0.8003, 42.5: 0.802799995
    };

    // Função para buscar JSON
    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status} for ${url}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Could not fetch ${url}:`, error);
            return null;
        }
    }

    // Função para obter o ícone do tipo
    function getTypeIcon(tipo) {
        const typeIcons = {
            'aço': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/aco.png',
            'água': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/agua.png',
            'dragão': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/dragao.png',
            'elétrico': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/eletrico.png',
            'fada': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fada.png',
            'fantasma': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fantasma.png',
            'fogo': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fogo.png',
            'gelo': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/gelo.png',
            'inseto': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/inseto.png',
            'lutador': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/lutador.png',
            'normal': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/normal.png',
            'pedra': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/pedra.png',
            'planta': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/planta.png',
            'psíquico': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/psiquico.png',
            'sombrio': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/sombrio.png',
            'terrestre': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/terrestre.png',
            'venenoso': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/venenoso.png',
            'voador': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/voador.png',
        };
        return typeIcons[tipo.toLowerCase()] || '';
    }

    // Função para obter o ícone do clima
    function getWeatherIcon(tipo) {
        const weatherIcons = {
            'planta': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png',
            'fogo': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png',
            'terrestre': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png',
            'água': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png',
            'elétrico': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png',
            'inseto': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png',
            'normal': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/parcialmente_nublado.png',
            'pedra': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/parcialmente_nublado.png',
            'fada': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png',
            'lutador': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png',
            'venenoso': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png',
            'voador': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png',
            'dragão': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png',
            'psíquico': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png',
            'gelo': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nevando.png',
            'aço': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nevando.png',
            'sombrio': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/neblina.png',
            'fantasma': 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/neblina.png',
        };
        return weatherIcons[tipo.toLowerCase()] || '';
    }

    // Função para calcular CP
    function calculateCP(baseStats, ivs, level) {
        const cpm = cpms[level];
        if (!cpm) {
            console.warn(`CPM not found for level ${level}`);
            return "N/A";
        }
        // Ensure baseStats and ivs are valid
        if (!baseStats || typeof baseStats.atk === 'undefined' || typeof baseStats.def === 'undefined' || typeof baseStats.hp === 'undefined' ||
            !ivs || typeof ivs.atk === 'undefined' || typeof ivs.def === 'undefined' || typeof ivs.hp === 'undefined') {
            console.error("Invalid baseStats or IVs provided for CP calculation.");
            return "N/A";
        }

        const cp = ((baseStats.atk + ivs.atk) *
            Math.sqrt(baseStats.def + ivs.def) *
            Math.sqrt(baseStats.hp + ivs.hp) *
            cpm ** 2) / 10;
        return Math.floor(cp);
    }

    // Carregar dados dos JSONs
    const pokemonData = await fetchJson(pokemonDataUrl);
    const typeData = await fetchJson(typeDataUrl);

    if (!pokemonData || !typeData) {
        raidListElement.innerHTML = '<li class="error-li">Erro ao carregar dados dos Pokémon ou tipos. Verifique os URLs dos JSONs ou a conexão.</li>';
        return;
    }

    for (const pokemonNameRaw of userPokemonList) {
        let isShiny = false;
        let isShadow = false;
        let pokemonNameSearch = pokemonNameRaw;

        if (pokemonNameSearch.includes("*")) {
            isShiny = true;
            pokemonNameSearch = pokemonNameSearch.replace("*", "");
        }
        if (pokemonNameSearch.includes("(shadow)")) {
            isShadow = true;
            pokemonNameSearch = pokemonNameSearch.replace(" (shadow)", "").trim();
        }

        // Normalização para Tatsugiri e outras formas
        let searchKey = pokemonNameSearch.toLowerCase();
        if (searchKey.includes("tatsugiri")) {
            if (searchKey.includes("curvada")) {
                searchKey = "tatsugiri (curly)";
            } else if (searchKey.includes("pendular")) {
                searchKey = "tatsugiri (droopy)";
            } else if (searchKey.includes("estendida")) {
                searchKey = "tatsugiri (stretchy)";
            } else {
                searchKey = "tatsugiri"; // Fallback for generic Tatsugiri if needed
            }
        }

        let foundPokemon = null;
        for (const p of pokemonData) {
            let jsonPokemonName = p.nome ? p.nome.toLowerCase() : ''; // Ensure p.nome exists
            // Adaptação para corresponder as formas de Tatsugiri no JSON
            if (jsonPokemonName.includes("tatsugiri")) {
                 if (jsonPokemonName.includes("(curly)") && searchKey.includes("(curly)")) {
                    foundPokemon = p;
                    break;
                } else if (jsonPokemonName.includes("(droopy)") && searchKey.includes("(droopy)")) {
                    foundPokemon = p;
                    break;
                } else if (jsonPokemonName.includes("(stretchy)") && searchKey.includes("(stretchy)")) {
                    foundPokemon = p;
                    break;
                } else if (jsonPokemonName === "tatsugiri" && searchKey === "tatsugiri") {
                    foundPokemon = p;
                    break;
                }
            } else if (jsonPokemonName === searchKey) {
                foundPokemon = p;
                break;
            }
        }

        const li = document.createElement('li');

        if (foundPokemon) {
            // Ensure types array exists
            const types = foundPokemon.tipos || [];
            if (types.length === 0) {
                console.warn(`Pokemon ${foundPokemon.nome} has no types defined.`);
            }

            // Determinar fraquezas
            const weaknesses = new Set();
            for (const pokemonType of types) {
                for (const typeInfo of typeData) {
                    // Ensure typeInfo and typeInfo.tipos exist
                    if (!typeInfo || !typeInfo.tipos) {
                        continue; // Skip if typeInfo or its types are malformed
                    }

                    // Busca por tipos únicos
                    if (typeInfo.tipos.length === 1 && typeInfo.tipos[0].toLowerCase() === pokemonType.toLowerCase()) {
                        // Use optional chaining (?.) and nullish coalescing (|| []) for safety
                        for (const weaknessType of (typeInfo.defesa?.fraqueza?.['1.6x'] || [])) {
                            weaknesses.add(weaknessType);
                        }
                    }
                    // Busca por combinações de tipos
                    if (typeInfo.tipos.length === 2 && types.length === 2) {
                        const sortedTypeInfoTypes = [...typeInfo.tipos].sort().map(t => t.toLowerCase());
                        const sortedPokemonTypes = [...types].sort().map(t => t.toLowerCase());
                        if (JSON.stringify(sortedTypeInfoTypes) === JSON.stringify(sortedPokemonTypes)) {
                             // Use optional chaining (?.) and nullish coalescing (|| []) for safety
                            for (const weaknessType of (typeInfo.defesa?.fraqueza?.['1.6x'] || [])) {
                                weaknesses.add(weaknessType);
                            }
                        }
                    }
                }
            }

            // Cálculo do CP (IVs 15/15/15 para raids)
            const baseStats = foundPokemon.statusBase;
            const ivsPerfect = { atk: 15, def: 15, hp: 15 };

            const cpLevel20 = calculateCP(baseStats, ivsPerfect, 20);
            const cpLevel25 = calculateCP(baseStats, ivsPerfect, 25);
            const cpRangeDisplay = `PC: ${cpLevel20} - ${cpLevel25}`;

            // Ícone do clima (baseado no primeiro tipo, ou lógica mais complexa se necessário)
            let weatherBoostIcon = '';
            if (types.length > 0) {
                 // Prioridade para tipos que influenciam mais o clima (ex: Água tem chuva, Fogo tem sol)
                let primaryWeatherType = types[0]; // Padrão
                if (types.includes("Água")) primaryWeatherType = "Água";
                else if (types.includes("Planta")) primaryWeatherType = "Planta";
                else if (types.includes("Elétrico")) primaryWeatherType = "Elétrico";
                // Adicione mais regras aqui se a prioridade de clima for importante para dual-types
                weatherBoostIcon = getWeatherIcon(primaryWeatherType);
            }


            li.innerHTML = `
                <img src="${foundPokemon.img || 'https://via.placeholder.com/150?text=No+Image'}" alt="${foundPokemon.nome}" class="pokemon-img">
                <h2 style="margin: 10px 0; font-size: 1.5em;">${pokemonNameRaw}</h2>
                <div class="type-icons">
                    ${types.map(type => `<img src="${getTypeIcon(type)}" alt="${type}" class="type-icon">`).join('')}
                </div>
                <div class="cp-info">
                    <p class="cp-text">${cpRangeDisplay}</p>
                    ${weatherBoostIcon ? `<img src="${weatherBoostIcon}" alt="Weather Boost" class="weather-icon" style="margin-left: 10px;">` : ''}
                </div>
                <button>Esconder Fraquezas</button>
                <div class="weaknesses-section">
                    <h3>Fraquezas</h3>
                    <p style="margin: 0 0 10px 0; font-weight: bold;">160%</p>
                    ${Array.from(weaknesses).sort().map(weakness => `
                        <div class="weakness-item">
                            ${weakness}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            li.classList.add('error-li');
            li.innerHTML = `
                <h2 style="margin: 10px 0;">${pokemonNameRaw}</h2>
                <p>Informações não encontradas no JSON de Pokémon.</p>
            `;
        }
        raidListElement.appendChild(li);
    }
});
