import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";

const Single = () => {
  const { theid } = useParams();
  const { state } = useLocation();
  const { store, actions } = useContext(Context);
  const [item, setItem] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [details, setDetails] = useState(null);
  const category = state?.category;

  const navigate = useNavigate();
  const selectedDetails = {
    characters: ["name", "height", "birth_year", "gender"],
    vehicles: ["name", "model", "manufacturer", "cost_in_credits"],
    starships: ["name", "model", "crew", "hyperdrive_rating"],
    planets: ["name", "climate", "terrain", "population"],
  };

  const defaultImageUrl = "https://wallpapers.com/images/featured/logo-de-star-wars-xcw4lfbj6xjx2qvm.jpg";

  const getImageUrl = (id, category) => {
    const baseUrl = `https://starwars-visualguide.com/assets/img`;
    switch (category) {
      case "characters":
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

  useEffect(() => {
    if (category && store[category]?.length > 0) {
      const foundItem = store[category].find((item) => item.uid === theid);
      setItem(foundItem || null);
    }
  }, [store, theid, category]);

  useEffect(() => {
    if (item) {
      const fetchDetails = async () => {
        try {
          const categoryUrls = {
            characters: "people",
            vehicles: "vehicles",
            starships: "starships",
            planets: "planets"
          };
          const categoryUrl = categoryUrls[category];
          if (!categoryUrl) {
            console.error("Invalid category:", category);
            return;
          }

          const response = await fetch(`https://www.swapi.tech/api/${categoryUrl}/${theid}`);

          if (!response.ok) {
            throw new Error(`Error fetching details: ${response.status}`);
          }

          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.result) {
              setDetails(data.result.properties);
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

  useEffect(() => {
    if (item) {
      const imageUrl = getImageUrl(item.uid, category);
      const checkImage = async () => {
        try {
          const response = await fetch(imageUrl, { method: "HEAD" });
          if (response.ok) {
            setImageUrl(imageUrl);
          } else {
            setImageUrl(defaultImageUrl);
          }
        } catch (error) {
          setImageUrl(defaultImageUrl);
        }
      };

      checkImage();
    }
  }, [item, category]);

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
            <img
              src={imageUrl}
              alt={item.name}
              className="img-fluid rounded-left"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h1 className="card-title">{item.name}</h1>
              <h3>Details</h3>
              <ul>
                {selectedDetails[category]?.map((key) => (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                    {details[key] || "N/A"}
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  Back
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