import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export const Single = () => {
  const { state } = useLocation();
  const { theid } = useParams();
  const [details, setDetails] = useState(null);
  const [imageExists, setImageExists] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const category = state?.category || "people";

  const getImageUrl = (id, category) => {
    const baseUrl = "https://starwars-visualguide.com/assets/img";
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
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://www.swapi.tech/api/${category}/${theid}`);
        const data = await response.json();
        if (data.result) {
          setDetails(data.result.properties);
        }
      } 
    };

    fetchDetails();
  }, [category, theid]);

  useEffect(() => {
    const url = getImageUrl(theid, category);
    setImageUrl(url);

    const checkImage = async () => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        setImageExists(response.ok);
      } catch (error) {
        setImageExists(false);
      }
    };

    checkImage();
  }, [category, theid]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{details.name || "Details"}</h1>
      <div className="row">
        <div className="col-md-12">
          <div className="item-card d-flex">
            {imageExists ? (
              <img
                src={imageUrl}
                alt={details.name}
                className="img-fluid rounded-left"
              />
            ) : (
              <p>No image available</p>
            )}
            <div className="item-info p-4">
              <h3>Details</h3>
              <ul>
                {Object.entries(details).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
