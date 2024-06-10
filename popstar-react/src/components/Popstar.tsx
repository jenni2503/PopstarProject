import React, { useEffect, useState } from "react";
import { Artist } from "../models/Artist";
import { api } from "../services/dataService";
import "../styles/Popstar.css";

interface PopstarProps {
    artist: Artist;
}

function getImageUrl(imagePath: string): string {
    const url = api + "image/" + imagePath;
    return url;
}

function Popstar({ artist }: PopstarProps) {
    const [imageUrl, setImageUrl] = useState<string>(
        getImageUrl("placeholder.jpg")
    );

    useEffect(() => {
        if (artist.image !== undefined && artist.image !== "") {
            setImageUrl(getImageUrl(artist.image));
        }
    }, [artist.image]);

    return (
        <div className="display-item text-center">
            <img
                src={imageUrl}
                alt={artist.name}
                className="rounded d-block img-fluid"
            />
            <div className="display-item-info">
                <h3>Name: {artist.name}</h3>
                <p>Category: {artist.category}</p>
            </div>
        </div>
    );
}

export default Popstar;
