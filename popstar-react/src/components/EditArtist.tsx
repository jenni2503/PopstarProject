import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Home.css";
import EditStar from "./EditStar";
import { Artist } from "../models/Artist";
import { getAllArtist } from "../services/dataService";

function EditArtist() {
    const [groups, setGroups] = useState<Artist[][]>([]);

    useEffect(() => {
        const getArtists = async () => {
            // get artists and put in groups of max 3
            const fetchedArtists = await getAllArtist();
            let newGroups: Artist[][] = [];
            for (let i = 0; i < fetchedArtists.length; i += 3) {
                newGroups.push(fetchedArtists.slice(i, i + 3));
            }
            setGroups(newGroups);
        };
        getArtists();
    }, []);

    return (
        <div>
            <h1>Popstars</h1>
            <Container className="display" fluid>
                {/* map over the groups of 3 items */}
                {groups.map((group, index) => (
                    <Row
                        key={index}
                        className="overflow-auto justify-content-md-center"
                    >
                        {/* map over the items in the group */}
                        {group.map((obj: Artist, i) => (
                            <Col key={i} sm="3" xs="3" lg="3" md="3" xl="3">
                                <EditStar artist={obj} />
                            </Col>
                        ))}
                    </Row>
                ))}
            </Container>
        </div>
    );
}

export default EditArtist;
