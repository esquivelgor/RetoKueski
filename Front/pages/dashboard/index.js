import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { SSRProvider } from '@react-aria/ssr';
import { Tab, Tabs, Container, Row, Col, Button, ButtonGroup, Form, Modal, Navbar, Toast, Nav, Alert, Card, Image, Pagination, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

function HomePage({ pendingData, notPendingData }) {

    if ( !pendingData || !notPendingData) {
        return <div>Loading...</div>
    }

    const GetPending = () => {
        return (
            <Table striped>
                <thead>
                    <tr>
                        <th>Petición ID</th>
                        <th>Cliente</th>
                        <th>Derecho a Ejercer</th>
                        <th>Creada</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingData.map((user) => (
                        <tr key={user.PETITION_ID}>
                            <th>{user.PETITION_ID}</th>
                            <th>{user.CLIENT_FULL_NAME}</th>
                            <th>{user.ARCO_RIGHT}</th>
                            <th>{new Date(user.CREATED_AT).toLocaleString('en-US', { timeZone: 'America/New_York' })}</th>
                            <th> <Button variant="success" onClick={() => SetArcoRight(user.ARCO_RIGHT, user.PETITION_ID)}>Ver</Button></th>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const GetNotPending = () => {
        return (
            <Table striped>
                <thead>
                    <tr>
                        <th>Petición ID</th>
                        <th>Cliente</th>
                        <th>Derecho a Ejercer</th>
                        <th>Estatus</th>
                        <th>Creada</th>
                        <th>Atendida</th>
                    </tr>
                </thead>
                <tbody>
                    {notPendingData.map((user) => (
                        <tr key={user.PETITION_ID}>
                            <th>{user.PETITION_ID}</th>
                            <th>{user.CLIENT_FULL_NAME}</th>
                            <th>{user.ARCO_RIGHT}</th>
                            <th>{user.CURRENT_STATUS}</th>
                            <th>{new Date(user.CREATED_AT).toLocaleString('en-US', { timeZone: 'America/New_York' })}</th>
                            <th>{new Date(user.UPDATED_AT).toLocaleString('en-US', { timeZone: 'America/New_York' })}</th>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };


    function SetArcoRight(pendingData, idPetition) {
        if (pendingData === 'Cancelación') {
            handleCancelation(idPetition);
        } else if (pendingData === 'Rectificación') {
            handleRectification(idPetition);
        } else if (pendingData === 'Oposición') {
            handleOpposition(idPetition);
        }
        else {
            console.error('Unknown variable value:', pendingData);
        }
    };

    // ---------------------- Cancelation -------------------

    const [showC, setShowC] = useState(false);
    const handleCancelationClose = () => setShowC(false);
    const [selectedPetitionId, setSelectedPetitionId] = useState(null);
    const handleCancelation = (idPetition) => {
        setSelectedPetitionId(idPetition);
        setShowC(true);
    }
    const GetCancelation = ({ id }) => {
        const [clientData, setClientData] = useState({
            CLIENT_ID: '',
            full_name: '',
            CLIENT_BIRTHDATE: '',
            CLIENT_NATIONALITY: '',
            CLIENT_STATE_OF_BIRTH: '',
            CLIENT_CURP: '',
            CLIENT_ECONOMIC_ACTIVITY: '',
            CLIENT_GENDER: '',
            CLIENT_PHONE_NUMBER: '',
            CLIENT_EMAIL: '',
            IS_CLIENT: '',
            IS_BLOCKED: '',
            IS_IN_OPOSITION: '',
            CREATED_AT: '',
            UPDATED_AT: '',
            DELETED_AT: ''
        });
        const [petitionData, setPetitionData] = useState({
            PETITION_ID: '',
            CLIENT_ID: '',
            CLIENT_FULL_NAME: '',
            ARCO_RIGHT: '',
            CURRENT_STATUS: '',
            PETITION_COMMENT: '',
            CREATED_AT: '',
            UPDATED_AT: ''
        });

        useEffect(() => {
            const fetchData = async () => {
                try {

                    const responsePetitionData = await fetch(`https://retokueski-production.up.railway.app/petition/${id}`);
                    const petitionData = await responsePetitionData.json();
                    setPetitionData(petitionData);

                    const responseClientData = await fetch(`https://retokueski-production.up.railway.app/user/${petitionData.CLIENT_ID}`);
                    const clientData = await responseClientData.json();
                    setClientData(clientData);


                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }, []);

        return (
            <Card.Body>
                <Card className="p-3">
                    <Card.Title className='p-1'>
                        Nombre: {clientData.full_name}
                    </Card.Title>
                    <Card.Title className="p-1">
                        Email: {clientData.CLIENT_EMAIL}
                    </Card.Title>
                    <Card.Title className="p-1">
                        Comentario: {petitionData.PETITION_COMMENT}
                    </Card.Title>
                </Card>
                <Card className='p-3'>
                    <ApprovePetitionButton idClient={clientData.CLIENT_ID} idPetition={petitionData.PETITION_ID} root={"cancelation"} />
                    <RejectPetitionButton idPetition={petitionData.PETITION_ID} />
                </Card>
            </Card.Body>
        );
    };

    // ---------------------- Opposition -------------------

    const [showO, setShowO] = useState(false);
    const handleOppositionClose = () => setShowO(false);
    const [selectedPetitionIdO, setSelectedPetitionIdO] = useState(null);
    const handleOpposition = (idPetition) => {
        setSelectedPetitionIdO(idPetition);
        setShowO(true);
    }
    const GetOpposition = ({ id }) => {
        const [clientData, setClientData] = useState({
            CLIENT_ID: '',
            full_name: '',
            CLIENT_BIRTHDATE: '',
            CLIENT_NATIONALITY: '',
            CLIENT_STATE_OF_BIRTH: '',
            CLIENT_CURP: '',
            CLIENT_ECONOMIC_ACTIVITY: '',
            CLIENT_GENDER: '',
            CLIENT_PHONE_NUMBER: '',
            CLIENT_EMAIL: '',
            IS_CLIENT: '',
            IS_BLOCKED: '',
            IS_IN_OPOSITION: '',
            CREATED_AT: '',
            UPDATED_AT: '',
            DELETED_AT: ''
        });

        const [petitionData, setPetitionData] = useState({
            PETITION_ID: '',
            CLIENT_ID: '',
            CLIENT_FULL_NAME: '',
            ARCO_RIGHT: '',
            CURRENT_STATUS: '',
            PETITION_COMMENT: '',
            CREATED_AT: '',
            UPDATED_AT: ''
        });

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const responsePetitionData = await fetch(`https://retokueski-production.up.railway.app/petition/${id}`);
                    const petitionData = await responsePetitionData.json();
                    setPetitionData(petitionData);

                    const responseClientData = await fetch(`https://retokueski-production.up.railway.app/user/${petitionData.CLIENT_ID}`);
                    const clientData = await responseClientData.json();
                    setClientData(clientData);

                    

                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }, []);

        return (
            <Card.Body>
                <Card className="p-3">
                    <Card.Title className='p-1'>
                        Nombre: {clientData.full_name}
                    </Card.Title>
                    <Card.Title className="p-1">
                        Email: {clientData.CLIENT_EMAIL}
                    </Card.Title>
                    <Card.Title className="p-1">
                        Comentario: {petitionData.PETITION_COMMENT}
                    </Card.Title>
                </Card>
                <Card className='p-3'>
                    <ApprovePetitionButton idClient={clientData.CLIENT_ID} idPetition={petitionData.PETITION_ID} root={"opposition"} />
                    <RejectPetitionButton idPetition={petitionData.PETITION_ID} />
                </Card>
            </Card.Body>
        );
    };
    // ---------------------- Rectification-------------------

    const [showR, setShowR] = useState(false);
    const handleRectificationClose = () => setShowR(false);
    const [selectedPetitionIdR, setSelectedPetitionIdR] = useState(null);
    const handleRectification = (idPetition) => {
        setSelectedPetitionIdR(idPetition);
        setShowR(true);
    }
    const GetRectification = ({ id }) => {
        const [clientOldData, setClientOldData] = useState({
            CLIENT_ID: '',
            full_name: '',
            CLIENT_BIRTHDATE: '',
            CLIENT_NATIONALITY: '',
            CLIENT_STATE_OF_BIRTH: '',
            CLIENT_CURP: '',
            CLIENT_ECONOMIC_ACTIVITY: '',
            CLIENT_GENDER: '',
            CLIENT_PHONE_NUMBER: '',
            CLIENT_EMAIL: '',
            IS_CLIENT: '',
            IS_BLOCKED: '',
            IS_IN_OPOSITION: '',
            CREATED_AT: '',
            UPDATED_AT: '',
            DELETED_AT: ''
        });

        const [clientData, setClientData] = useState({
            ID: '',
            PETITION_ID: '',
            CLIENT_ID: '',
            new_full_name: '',
            NEW_BIRTHDATE: '',
            NEW_NATIONALITY: '',
            NEW_STATE_OF_BIRTH: '',
            NEW_CURP: '',
            NEW_ECONOMIC_ACTIVITY: '',
            NEW_GENDER: '',
            NEW_PHONE_NUMBER: '',
            NEW_EMAIL: ''
        });

        const [petitionData, setPetitionData] = useState({
            PETITION_ID: '',
            CLIENT_ID: '',
            CLIENT_FULL_NAME: '',
            ARCO_RIGHT: '',
            CURRENT_STATUS: '',
            PETITION_COMMENT: '',
            CREATED_AT: '',
            UPDATED_AT: ''
        });

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const responseClientData = await fetch(`https://retokueski-production.up.railway.app/petition/${id}/rectification`);
                    const clientData = await responseClientData.json();
                    setClientData(clientData);

                    const responseClientOldData = await fetch(`https://retokueski-production.up.railway.app/user/${clientData.CLIENT_ID}`);
                    const clientOldData = await responseClientOldData.json();
                    setClientOldData(clientOldData);



                    const responsePetitionData = await fetch(`https://retokueski-production.up.railway.app/petition/${id}`);
                    const petitionData = await responsePetitionData.json();
                    setPetitionData(petitionData);

                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }, []);

        return (
            <Card.Body>
                <Card className='p-3'>
                    <Table striped>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Dato Previo</th>
                                <th>Dato Nuevo</th>
                            </tr>
                            <tr>
                                <th>Cliente</th>
                                <td>{clientOldData.full_name}</td>
                                <td style={{ color: 'green' }}>{clientData.new_full_name}</td>
                            </tr>
                            <tr>
                                <th>Fecha de nacimiento</th>
                                <td>{new Date(clientOldData.CLIENT_BIRTHDATE).toLocaleString('en-US', { timeZone: 'America/New_York' })}</td>
                                <td style={{ color: 'green' }}>{new Date(clientData.NEW_BIRTHDATE).toLocaleString('en-US', { timeZone: 'America/New_York' })}</td>
                            </tr>
                            <tr>
                                <th>Nacionalidad</th>
                                <td>{clientOldData.CLIENT_NATIONALITY}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_NATIONALITY}</td>
                            </tr>
                            <tr>
                                <th>Estado de nacimiento</th>
                                <td>{clientOldData.CLIENT_STATE_OF_BIRTH}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_STATE_OF_BIRTH}</td>
                            </tr>
                            <tr>
                                <th>CURP</th>
                                <td>{clientOldData.CLIENT_CURP}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_CURP}</td>
                            </tr>
                            <tr>
                                <th>Actividad Económica</th>
                                <td>{clientOldData.CLIENT_ECONOMIC_ACTIVITY}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_ECONOMIC_ACTIVITY}</td>
                            </tr>
                            <tr>
                                <th>Género</th>
                                <td>{clientOldData.CLIENT_GENDER}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_GENDER}</td>
                            </tr>
                            <tr>
                                <th>Número de teléfono</th>
                                <td>{clientOldData.CLIENT_PHONE_NUMBER}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_PHONE_NUMBER}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{clientOldData.CLIENT_EMAIL}</td>
                                <td style={{ color: 'green' }}>{clientData.NEW_EMAIL}</td>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </Table>
                </Card>
                <Card className='p-3'>
                    <ApprovePetitionButton idClient={clientData.CLIENT_ID} idPetition={petitionData.PETITION_ID} root={"rectification"} />
                    <RejectPetitionButton idPetition={petitionData.PETITION_ID} />
                </Card>
            </Card.Body>


        );
    };

    const ApprovePetitionButton = ({ idClient, idPetition, root }) => {
        const [message, setMessage] = useState('');

        const handleApprove = async () => {
            try {
                const approveResponse = await fetch(
                    `https://retokueski-production.up.railway.app/petition/${idPetition}/approve`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    }
                );
                const approveData = await approveResponse.json();

                const oppositionResponse = await fetch(
                    `https://retokueski-production.up.railway.app/user/${idClient}/${root}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    }
                );
                const oppositionData = await oppositionResponse.json();

                setShowC(false);
            } catch (error) {
                console.log(error);
            }
        };

        return (
            <>
                <Card>
                    <Button variant="success" onClick={() => {
                        handleApprove();
                        handleCancelationClose();
                        handleRectificationClose();
                        handleOppositionClose();
                    }}>
                        Aprobar
                    </Button>
                </Card>
                <Card>
                    {message}
                </Card>

            </>
        );
    };

    const RejectPetitionButton = ({ idPetition }) => {
        const [message, setMessage] = useState('');

        const handleApprove = async () => {
            try {
                const response = await fetch(
                    `https://retokueski-production.up.railway.app/petition/${idPetition}/reject`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    }
                );
                const data = await response.json();

                setMessage(data.message);
            } catch (error) {
                console.log(error);
            }
        };

        return (
            <>
                <Card>
                    <Button variant="danger" onClick={() => {
                        handleApprove();
                        handleCancelationClose();
                        handleRectificationClose();
                        handleOppositionClose();
                    }}>
                        Rechazar
                    </Button>
                </Card>
                <Card>
                    {message}
                </Card>

            </>
        );
    };

    return (
        <SSRProvider>
            <title>Derechos Arco</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Container>
                <Row className='p-3'>
                    <Card>
                        <Col className='p-1' xs={5} md={2}>
                            <Image src="Kueski.png" fluid />
                        </Col>
                    </Card>
                </Row>
                <Row>
                    <Col md={2}>
                        <Card className="p-2">
                            <Card.Body>
                                <Card className="p-3 ">
                                    <Card.Subtitle className='mb-2 text-muted'>Nacho Kueski</Card.Subtitle>
                                </Card>
                                <Card className="p-2">
                                    <Card.Title>Tablero Arco</Card.Title>
                                </Card>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={10}>
                        <Card className="p-2">
                            <Card.Body>
                                <Card.Title>Tablero</Card.Title>
                                <Tabs
                                    defaultActiveKey="profile"
                                    id="justify-tab-example"
                                    className="mb-3"
                                    justify
                                >
                                    <Tab eventKey="pending" title="Pendientes">
                                        <GetPending />
                                    </Tab>
                                    <Tab eventKey="notpending" title="Atendidas">
                                        <GetNotPending />
                                    </Tab>
                                </Tabs>

                                <Modal show={showC} onHide={handleCancelationClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Cancelación de servicio</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <GetCancelation id={selectedPetitionId} />
                                    </Modal.Body>
                                </Modal>

                                <Modal show={showO} onHide={handleOppositionClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Oposición de información</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <GetOpposition id={selectedPetitionIdO} />
                                    </Modal.Body>
                                </Modal>

                                <Modal size="lg" show={showR} onHide={handleRectificationClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Rectificación de información</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <GetRectification id={selectedPetitionIdR} />
                                    </Modal.Body>
                                </Modal>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Container className='p-3'>
                <Card>
                    <Col className='p-1'>
                        <Nav className="me-auto">
                            <Nav.Link>Desarrolladores:</Nav.Link>
                            <Nav.Link href="https://github.com/esquivelgor">Guillermo Esquivel</Nav.Link>
                            <Nav.Link href="#features">Moises Hiram</Nav.Link>
                            <Nav.Link href="#features">Samuel Garcia</Nav.Link>
                            <Nav.Link href="#features">Gonzalo Calderón</Nav.Link>
                        </Nav >
                    </Col>
                </Card>
            </Container>
        </SSRProvider>
    )
}

// This function gets called at build time
export async function getServerSideProps() {
    // Fetch data from external API

    const resPendingData = await fetch(`https://retokueski-production.up.railway.app/dashboard/pending`)
    const pendingData = await resPendingData.json()

    const resNotPendingData = await fetch(`https://retokueski-production.up.railway.app/dashboard/notPending`)
    const notPendingData = await resNotPendingData.json()
    // Pass data to the page via props
    return { props: { pendingData, notPendingData } }
}

export default HomePage