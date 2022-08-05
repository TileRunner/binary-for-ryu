import Form from 'react-bootstrap/Form';

const InputWord = ({myword, setMyword, handleSubmit}) => {
    function isValidFormat(s) {
        let alphabeticPattern = /^[A-Za-z]+$/;
        return alphabeticPattern.test(s);
    }
    return (
    <Form onSubmit={handleSubmit}>
        <Form.Label>Your Word:</Form.Label>
        <Form.Control
        type="text"
        value={myword}
        onChange={e => { setMyword(e.target.value); } }
        isInvalid={myword && !isValidFormat(myword)}
        />
        <Form.Control.Feedback type="invalid">Must only use letters</Form.Control.Feedback>
    </Form>
    );
}

export default InputWord;