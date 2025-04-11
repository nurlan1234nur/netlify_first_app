import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load questions from JSON file
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        // Initialize userAnswers with empty values
        const initialAnswers = {};
        data.forEach((_, index) => {
          initialAnswers[index] = '';
        });
        setUserAnswers(initialAnswers);
      })
      .catch(error => console.error('Error loading questions:', error));
  }, []);

  const handleAnswerChange = (event) => {
    const newAnswers = { ...userAnswers };
    newAnswers[currentQuestionIndex] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return <Container className="mt-5">Loading questions...</Container>;
  }

  if (showResults) {
    return (
      <Container className="test-container">
        <Card className="result-container">
          <Card.Body>
            <Card.Title className="text-center mb-4">Тестийн Үр Дүн</Card.Title>
            <Alert variant="info" className="text-center">
              Та {questions.length} асуултаас {score} зөв хариулсан байна.
            </Alert>
            <div className="text-center mt-4">
              <Button variant="primary" onClick={resetTest}>
                Дахин Эхлэх
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container className="test-container">
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">
            Асуулт {currentQuestionIndex + 1}/{questions.length}
          </Card.Title>
          
          <Card.Text className="mb-4">{currentQuestion.question}</Card.Text>
          
          <Form>
            {currentQuestion.options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                id={`option-${index}`}
                label={option}
                name="answer"
                value={option}
                checked={userAnswers[currentQuestionIndex] === option}
                onChange={handleAnswerChange}
                className="mb-2"
              />
            ))}
          </Form>
          
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Өмнөх
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIndex]}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Дуусгах' : 'Дараах'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App; 