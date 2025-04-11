import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col } from 'react-bootstrap';

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load topics from JSON file
    fetch('/topics.json')
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error('Error loading topics:', error));
  }, []);

  useEffect(() => {
    if (selectedTest) {
      // Load questions for selected test
      fetch(`/tests/${selectedTest.id}.json`)
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
    }
  }, [selectedTest]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

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

  const goBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (topics.length === 0) {
    return <Container className="mt-5">Loading topics...</Container>;
  }

  if (!selectedTopic) {
    return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">Сэдэв Сонгох</h2>
        <Row>
          {topics.map((topic) => (
            <Col key={topic.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{topic.name}</Card.Title>
                  <Card.Text>{topic.description}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleTopicSelect(topic)}
                    className="w-100"
                  >
                    Сонгох
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (!selectedTest) {
    return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">{selectedTopic.name}</h2>
        <Button 
          variant="secondary" 
          onClick={goBackToTopics}
          className="mb-4"
        >
          Буцах
        </Button>
        <Row>
          {selectedTopic.tests.map((test) => (
            <Col key={test.id} xs={12} md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{test.name}</Card.Title>
                  <Card.Text>{test.description}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleTestSelect(test)}
                    className="w-100"
                  >
                    Эхлэх
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

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
              <Button variant="primary" onClick={resetTest} className="me-2">
                Дахин Эхлэх
              </Button>
              <Button variant="secondary" onClick={goBackToTopics}>
                Сэдэв Сонгох
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
            {selectedTopic.name} - {selectedTest.name}
          </Card.Title>
          <Card.Subtitle className="mb-4">
            Асуулт {currentQuestionIndex + 1}/{questions.length}
          </Card.Subtitle>
          
          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              alt="Question"
              className="question-image"
            />
          )}
          
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