import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = ({loggedIn, setLoggedIn, username, setUsername}) => {
    function isDataAcceptable() {
        return username.length > 0 && isValidFormat(username);
    }
    function handleSubmit(event) {
        event.preventDefault();
        setLoggedIn(true);
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
    }
    const UserLogout = <div className='Login'>
        <Row>
            <Col xs="auto">
                Username: {username}
            </Col>
            <Col>
                <Button onClick={() => {setLoggedIn(false);}}>Log out</Button>
            </Col>
        </Row>
    </div>;
    const UserLogin = <div className="Login">
        <h1>Login</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="username" className="mb-3">
                <Form.Label column sm={1}>Username:</Form.Label>
                <Col sm={3}>
                    <Form.Control
                        className="mb-3"
                        type="text"
                        value={username}
                        onChange={e => { setUsername(e.target.value); } }
                        isInvalid={username && !isValidFormat(username)} />
                    <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button variant="primary" disabled={!isDataAcceptable()} type="submit">Submit</Button>
        </Form>
    </div>;
    return (
        loggedIn ? UserLogout : UserLogin
    );
}

export default Login;