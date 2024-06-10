import React, { useState } from "react";
import { Artist } from "../models/Artist";
import {
    api,
    deleteArtist,
    updateArtist,
    updateImage,
    deleteImage,
} from "../services/dataService";
import "../styles/Popstar.css";

interface PopstarProps {
    artist: Artist;
}

function getImageUrl(imagePath: string): string {
    const url = api + "image/" + imagePath;
    return url;
}

function EditStar({ artist }: PopstarProps) {
    const [name, setName] = useState<string>(artist.name);
    const [category, setCategory] = useState<string>(artist.category);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string>(
        getImageUrl(artist.image || "placeholder.jpg")
    );

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCategory(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        const updatedArtist: Artist = {
            ...artist,
            name,
            category,
        };
        console.log("saved");
        console.log(image);
        if (name === "" || category === "") {
            alert("Please fill in all fields!");
        } else if (image === undefined) {
            updateArtist(artist.id, {
                id: artist.id,
                name: name,
                category: category,
                image: artist.image,
            })
                .then((response) => {
                    if (response.status == 204) {
                        alert("updated successfully");
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        } else {
            updateArtist(artist.id, {
                id: artist.id,
                name: name,
                category: category,
                image: artist.image,
            })
                .then((response) => {
                    if (response.status == 204) {
                        alert("updated info successfully");
                    } else {
                        throw Error("id not found " + artist);
                    }
                })
                .catch((error) => {
                    alert(error);
                });
            updateImage(artist.image, image)
                .then((response) => {
                    if (response.status == 204) {
                        alert("updated image successfully");
                    } else {
                        throw Error("image not found " + artist.image);
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    function refreshPage() {
        window.location.reload();
    }

    const handleDelete = () => {
        console.log("deleted");
        deleteArtist(artist.id)
            .then((response) => {
                console.log(response);
                if (response.status === 204) {
                    deleteImage(artist.image); //happens concurrently
                    alert("Popstar: " + artist.name + " deleted successfully");
                    refreshPage();
                }
            })
            .catch((error) => {
                alert(error);
                console.log(error);
            });
    };

    return (
        <div className="display-item text-center">
            <img
                src={imageUrl}
                alt={artist.name}
                className="rounded d-block img-fluid"
            />
            <div className="display-item-info">
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={handleCategoryChange}
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <button
                        className="btn btn-success"
                        type="button"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditStar;
