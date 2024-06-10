import { Artist } from "../models/Artist";

const api = "https://localhost:7166/";


async function getAllArtist(): Promise<Artist[]> {
    const results: Artist[] = await (await fetch(api + "artist")).json();
    return results;
}

function addArtist(artist: Artist) {
    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(artist),
        headers: { "Content-Type": "application/json" },
    };
    return fetch(api + "artist/", requestOptions);
}

function deleteArtist(id: number) {
    return fetch(api + "artist/" + id, {
        method: "DELETE",
    });
}

function updateArtist(id: number, updatedArtist: Artist) {
    const requestOptions: RequestInit = {
        method: "PUT",
        body: JSON.stringify(updatedArtist),
        headers: { "Content-Type": "application/json" },
    };
    return fetch(api + "artist/" + id, requestOptions);
}

function getImage(filename: string) {
    const result = fetch(api + "image/" + filename);
    return result;
}

function updateImage(filename: string, updatedImage: File) {
    const formData = new FormData();
    formData.append("file", updatedImage);

    const requestOptions: RequestInit = {
        method: "PUT",
        body: formData,
    };

    return fetch(api + "image/" + filename, requestOptions);
}

function deleteImage(filename: string) {
    return fetch(api + "artist/" + filename, {
        method: "DELETE",
    });
}

function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const requestOptions: RequestInit = {
        method: "POST",
        body: formData,
    };

    return fetch(api + "image/", requestOptions);
}

export { getAllArtist, addArtist, deleteArtist, updateArtist, api };
export { uploadImage, getImage, updateImage, deleteImage };
