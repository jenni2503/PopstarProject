import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import "../styles/AddArtist.css";
import { uploadImage, addArtist } from "../services/dataService";

function AddArtist() {
    const [inputs, setInputs] = useState({
        obj_name: "",
        obj_category: "",
        obj_image: "",
    });
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event: any) => {
        if (
            inputs.obj_name === "" ||
            inputs.obj_category === "" ||
            uploadedFile === undefined
        ) {
            alert("Please fill in all fields!");
        } else {
            uploadImage(uploadedFile)
                .then((response) => response.json())
                .then((data) => {
                    const sendObj = {
                        id: 0,
                        name: inputs.obj_name,
                        category: inputs.obj_category,
                        image: data.fileName,
                    };
                    addArtist(sendObj)
                        .then((response) => response)
                        .then((data) => {
                            if (data.status == 201) {
                                alert("Successfully added");
                                setInputs({
                                    obj_name: "",
                                    obj_category: "",
                                    obj_image: "",
                                });
                            } else {
                                alert("something wrong happended!");
                                throw Error;
                            }
                        })
                        .catch((error) => {
                            alert(error);
                        });
                })
                .catch((error) => {
                    alert(error);
                });
        }
        event.preventDefault();
    };

    const handleUpload = (event: any) => {
        inputRef.current?.click();
        event.preventDefault();
    };

    const handleDisplayFileDetails = (event: any) => {
        inputRef.current?.files && setUploadedFile(inputRef.current.files[0]);
        event.preventDefault();
    };

    return (
        <Container className="add-artist">
            <form className="" onSubmit={handleSubmit}>
                <Container className="form-group">
                    <label>
                        Enter artist name:
                        <input
                            className="form-control"
                            type="text"
                            name="obj_name"
                            value={inputs.obj_name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                        />
                    </label>
                </Container>
                <Container className="form-group">
                    <label>
                        Enter artist category(genre):
                        <input
                            className="form-control"
                            type="text"
                            name="obj_category"
                            value={inputs.obj_category || ""}
                            onChange={handleChange}
                            placeholder="Enter category"
                        />
                    </label>
                </Container>
                <Container className="form-group">
                    <label className="mx-3">Choose file:</label>
                    <input
                        ref={inputRef}
                        onChange={handleDisplayFileDetails}
                        className="d-none form-control"
                        type="file"
                    />
                    <button
                        onClick={handleUpload}
                        className={`btn btn-outline-${
                            uploadedFile ? "success" : "primary"
                        }`}
                    >
                        {uploadedFile ? uploadedFile.name : "Upload"}
                    </button>
                </Container>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value={"Add artist"}
                />
            </form>
        </Container>
    );
}

export default AddArtist;
