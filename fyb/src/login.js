import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = ({setLoggedIn, username, setUsername, password, setPassword}) => {
    function isDataAcceptable() {
        return username.length > 0 && password.length > 0 && isValidFormat(username) && isValidFormat(password);
    }
    function handleSubmit(event) {
        event.preventDefault();
        setLoggedIn(true);
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
    }
    return (
        <div className="Login">
            <h1>Login page</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="username" className="mb-3">
                    <Form.Label column sm={1}>Username:</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                        className="mb-3"
                        type="text"
                        value={username}
                        onChange={e => {setUsername(e.target.value);}}
                        isInvalid={username && !isValidFormat(username)}
                        />
                        <Form.Control.Feedback type="invalid">must only use letters and/or numbers and/or spaces</Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="password" className="mb-3">
                    <Form.Label column sm={1}>Password:</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                        className="mb-3"
                        value={password}
                        onChange={e => {setPassword(e.target.value);}} type="password"
                        isInvalid={password && !isValidFormat(password)}
                        />
                        <Form.Control.Feedback type="invalid">must only use letters and/or numbers and/or spaces</Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Button variant="primary" disabled={!isDataAcceptable()} type="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default Login;