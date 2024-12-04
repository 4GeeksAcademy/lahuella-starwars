import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const getImageUrl = (id, category) => {
  const baseUrl = "https://starwars-visualguide.com/assets/img";
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

export const Single = () => {
  const { theid } = useParams();
  const { store } = useContext(Context);
  const [item, setItem] = useState(null);
  const [imageExists, setImageExists] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {

    let foundItem = null;
    let category = "";

    if (store.characters.length > 0) {
      foundItem = store.characters.find((character) => character.uid === theid);
      if (foundItem) category = "people";
    }

    if (!foundItem && store.vehicles.length > 0) {
      foundItem = store.vehicles.find((vehicle) => vehicle.uid === theid);
      if (foundItem) category = "vehicles";
    }

    if (!foundItem && store.starships.length > 0) {
      foundItem = store.starships.find((starship) => starship.uid === theid);
      if (foundItem) category = "starships";
    }

    if (!foundItem && store.planets.length > 0) {
      foundItem = store.planets.find((planet) => planet.uid === theid);
      if (foundItem) category = "planets";
    }

    if (foundItem) {
      setItem(foundItem);
      setCategory(category);
    }
  }, [store, theid]);

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

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{item.name}</h1>
      <div className="row">
        <div className="col-md-12">
          <div className="item-card d-flex">
            {imageExists ? (
              <img
                src={getImageUrl(item.uid, category)}
                alt={item.name}
                className="img-fluid rounded-left"
              />
            ) : (
              <p>No image available</p>
            )}
            <div className="item-info p-4">
              <h3>Details</h3>
              <ul>
                {Object.keys(item).map((key) => {
                  if (key !== "uid") {
                    return (
                      <li key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                        {item[key]}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};