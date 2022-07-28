import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = ({setLoggedIn, username, setUsername, password, setPassword}) => {
    function performValidation() {
        return username.length > 0 && password.length > 0;
    }
    function handleSubmit(event) {
        event.preventDefault();
        setLoggedIn(true);
    }
    return (
        <div className="Login">
            <h1>Log in page</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control autofocus type="text" value={username} onChange={e => setUsername(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control autofocus value={password} onChange={e => setPassword(e.target.value)} type="password"></Form.Control>
                </Form.Group>
                <Button variant="primary" disabled={!performValidation()} type="submit">Log In</Button>
            </Form>
        </div>
    );
}

export default Login;