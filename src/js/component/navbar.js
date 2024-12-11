import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <span className="logo">Star Wars Wiki</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Favorites
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {store.favorites.length > 0 ? (
                                    store.favorites.map((favorite, index) => (
                                        <li key={index} className="d-flex justify-content-between">
                                            <a className="dropdown-item">
                                            <p>{favorite.name}</p>
                                            </a>
                                            <button
                                                className="btn btn-link text-danger"
                                                onClick={() => actions.removeFavorite(favorite.id)}
                                                aria-label="Remove from favorites"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            No Favorites Yet
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};