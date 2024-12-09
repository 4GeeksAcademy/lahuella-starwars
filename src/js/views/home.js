import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Home = () => {
    const { store, actions } = useContext(Context);

    const renderCategory = (title, items, type) => (
        <div>
            <h2 className="fade-in">{title}</h2>
            <div className="row">
                {items.map((item) => {
                    const imageUrl = `https://starwars-visualguide.com/assets/img/${type}/${item.uid}.jpg`;

                    return (
                        <div key={item.uid} className="col-3">
                            <div className="card fade-in">
                                <img src={imageUrl} alt={item.name} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <Link
                                        to={`/single/${item.uid}`}
                                        state={{ category: type }}
                                        className="btn btn-primary me-1">
                                        Info
                                    </Link>
                                    <button
                                        onClick={() => actions.addFavorite({ id: item.uid, name: item.name })}
                                        className="btn btn-warning"
                                    >
                                        + Fav
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="container">
            {renderCategory("Characters", store.characters, "characters")}
            {renderCategory("Vehicles", store.vehicles, "vehicles")}
            {renderCategory("Starships", store.starships, "starships")}
            {renderCategory("Planets", store.planets, "planets")}
        </div>
    );
};

