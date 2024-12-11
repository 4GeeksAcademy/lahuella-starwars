const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      characters: [],
      vehicles: [],
      starships: [],
      planets: [],
      favorites: [],
    },
    actions: {
      loadCharacters: async () => {
        try {
          const response = await fetch("https://www.swapi.tech/api/people");
          const data = await response.json();
          setStore({ characters: data.results });
        } catch (error) {
          console.error("Error loading characters:", error);
        }
      },
      loadVehicles: async () => {
        try {
          const response = await fetch("https://www.swapi.tech/api/vehicles");
          const data = await response.json();
          setStore({ vehicles: data.results });
        } catch (error) {
          console.error("Error loading vehicles:", error);
        }
      },
      loadStarships: async () => {
        try {
          const response = await fetch("https://www.swapi.tech/api/starships");
          const data = await response.json();
          setStore({ starships: data.results });
        } catch (error) {
          console.error("Error loading starships:", error);
        }
      },
      loadPlanets: async () => {
        try {
          const response = await fetch("https://www.swapi.tech/api/planets");
          const data = await response.json();
          setStore({ planets: data.results });
        } catch (error) {
          console.error("Error loading planets:", error);
        }
      },
      addFavorite: (item) => {
        const store = getStore();
        if (!store.favorites.find(fav => fav.id === item.id)) {
          setStore({ favorites: [...store.favorites, item] });
        }
      },

      removeFavorite: (id) => {
        const store = getStore();
        setStore({ favorites: store.favorites.filter(fav => fav.id !== id) });
      },

      loadInitialData: () => {
        const actions = getActions();
        actions.loadCharacters();
        actions.loadVehicles();
        actions.loadStarships();
        actions.loadPlanets();
      },
    },
  };
};

export default getState;