import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Reemplazamos useHistory por useNavigate
import { Context } from "../store/appContext"; // Importa el contexto de la app

const Single = () => {
  const { theid } = useParams(); // Obtiene el ID del parámetro de la URL
  const { state } = useLocation(); // Obtiene el estado (como la categoría)
  const { store, actions } = useContext(Context); // Accede al contexto para obtener el store y las acciones
  const [item, setItem] = useState(null); // Estado para guardar el ítem
  const [imageExists, setImageExists] = useState(false); // Estado para verificar si la imagen existe
  const [details, setDetails] = useState(null); // Estado para guardar los detalles del ítem
  const category = state?.category; // Obtiene la categoría desde el estado

  const navigate = useNavigate(); // Usamos useNavigate en lugar de useHistory

  // Función para verificar si la imagen existe
  const getImageUrl = (id, category) => {
    const baseUrl = `https://starwars-visualguide.com/assets/img`;
    switch (category) {
      case "people":
        return `${baseUrl}/characters/${id}.jpg`;
      case "vehicles":
        return `${baseUrl}/vehicles/${id}.jpg`;
      case "starships":
        return `${baseUrl}/starships/${id}.jpg`;
      case "planets":
        return `${baseUrl}/planets/${id}.jpg`;
      default:
        return "";
    }
  };

  // Fetch los detalles del ítem
  useEffect(() => {
    if (category && store[category]?.length > 0) {
      const foundItem = store[category].find((item) => item.uid === theid);
      setItem(foundItem || null);
    }
  }, [store, theid, category]);

  // Obtener detalles adicionales de la API
  useEffect(() => {
    if (item) {
      const fetchDetails = async () => {
        try {
          // Definir las categorías y sus rutas correspondientes
          const categoryUrls = {
            characters: "people",  // Para personajes
            vehicles: "vehicles",  // Para vehículos
            starships: "starships", // Para naves
            planets: "planets"     // Para planetas
          };
      
          // Construir la URL según la categoría seleccionada
          const categoryUrl = categoryUrls[category];
          if (!categoryUrl) {
            console.error("Invalid category:", category);
            return;
          }
      
          // Hacer el fetch usando la URL correcta
          const response = await fetch(`https://www.swapi.tech/api/${categoryUrl}/${theid}`);
          
          // Verificar si la respuesta es exitosa
          if (!response.ok) {
            throw new Error(`Error fetching details: ${response.status}`);
          }
      
          // Verificar si la respuesta es de tipo JSON
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.result) {
              setDetails(data.result.properties); // Guardamos las propiedades del ítem
            } else {
              console.error("Error: No result found for this item");
            }
          } else {
            console.error("Expected JSON, but got:", contentType);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      };      

      fetchDetails();
    }
  }, [item, category, theid]);

  // Verificar si la imagen existe
  useEffect(() => {
    if (item) {
      const imageUrl = getImageUrl(item.uid, category);
      const checkImage = async () => {
        try {
          const response = await fetch(imageUrl, { method: "HEAD" });
          setImageExists(response.ok);
        } catch (error) {
          setImageExists(false);
        }
      };

      checkImage();
    }
  }, [item, category]);

  // Función para agregar el ítem a favoritos
  const addToFavorites = () => {
    actions.addFavorite(item);
  };

  // Si no hay categoría o el ítem no existe
  if (!category) {
    return <div>Error: No category provided</div>;
  }

  if (!item || !details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="row">
          <div className="col-md-4">
            {imageExists ? (
              <img
                src={getImageUrl(item.uid, category)}
                alt={item.name}
                className="img-fluid rounded-left"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h1 className="card-title">{item.name}</h1>
              <h3>Details</h3>
              <ul>
                {details ? (
                  Object.keys(details).map((key) => (
                    <li key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                      {details[key]}
                    </li>
                  ))
                ) : (
                  <li>No details available</li>
                )}
              </ul>
              <div className="d-flex justify-content-between">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  Back
                </button>
                <button onClick={addToFavorites} className="btn btn-primary">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
