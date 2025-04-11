import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, ProgressBar } from 'react-bootstrap';

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
    return (
      <Container className="test-container">
        <Card>
          <Card.Body className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Асуултуудыг уншиж байна...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    return (
      <Container className="test-container">
        <Card className="result-container">
          <Card.Body>
            <Card.Title className="text-center mb-4">Тестийн Үр Дүн</Card.Title>
            <ProgressBar 
              now={percentage} 
              label={`${Math.round(percentage)}%`}
              className="mb-4"
            />
            <Alert variant="info" className="text-center">
              <h4 className="mb-0">Баяр хүргэе!</h4>
              <p className="mb-0 mt-2">
                Та {questions.length} асуултаас {score} зөв хариулсан байна.
              </p>
            </Alert>
            <div className="text-center mt-4">
              <Button variant="primary" onClick={resetTest} size="lg">
                Дахин Эхлэх
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container className="test-container">
      <Card>
        <Card.Body>
          <ProgressBar 
            now={progress} 
            label={`${Math.round(progress)}%`}
            className="mb-4"
          />
          <Card.Title className="mb-4">
            Асуулт {currentQuestionIndex + 1}/{questions.length}
          </Card.Title>
          
          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              alt="Question"
              className="question-image"
            />
          )}
          
          <Card.Text className="mb-4 fs-5">{currentQuestion.question}</Card.Text>
          
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
              size="lg"
            >
              Өмнөх
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIndex]}
              size="lg"
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