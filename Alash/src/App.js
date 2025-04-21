import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';

function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startQuiz, setStartQuiz] = useState(false);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        const uniqueTopics = [...new Set(data.map(q => q.topic))];
        setTopics(uniqueTopics);
      })
      .catch(err => console.error('Error loading questions:', err));
  }, []);

  const handleTopicChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTopics(prev =>
      checked ? [...prev, value] : prev.filter(t => t !== value)
    );
  };

  const startTest = () => {
    const filtered = allQuestions.filter(q => selectedTopics.includes(q.topic));
    const initialAnswers = {};
    filtered.forEach((_, index) => {
      initialAnswers[index] = '';
    });
    setFilteredQuestions(filtered);
    setUserAnswers(initialAnswers);
    setStartQuiz(true);
  };

  const handleAnswerChange = (e) => {
    const updated = { ...userAnswers };
    updated[currentQuestionIndex] = e.target.value;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    let correct = 0;
    filteredQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setStartQuiz(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedTopics([]);
    setFilteredQuestions([]);
  };

  if (!startQuiz) {
    return (
      <Container className="mt-5">
        <Card className="p-4">
          <Card.Title>Сэдэв сонгоно уу</Card.Title>
          <Form>
            {topics.map((topic, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={topic}
                value={topic}
                checked={selectedTopics.includes(topic)}
                onChange={handleTopicChange}
              />
            ))}
          </Form>
          <Button
            className="mt-3"
            onClick={startTest}
            disabled={selectedTopics.length === 0}
          >
            Тест Эхлүүлэх
          </Button>
        </Card>
      </Container>
    );
  }

  if (filteredQuestions.length === 0) {
    return <Container className="mt-5">Асуулт олдсонгүй...</Container>;
  }

  if (showResults) {
    return (
      <Container className="mt-5">
        <Card className="p-4">
          <Card.Title className="text-center">Тестийн Үр Дүн</Card.Title>
          <Alert variant="info" className="text-center mt-3">
            Та {filteredQuestions.length} асуултаас {score} зөв хариулсан байна.
          </Alert>
          <div className="text-center mt-4">
            <Button variant="primary" onClick={resetQuiz}>
              Дахин Эхлэх
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <Card.Title>Асуулт {currentQuestionIndex + 1}</Card.Title>

        {/* Зураг байвал харуулах */}
        {currentQuestion.image && (
          <img
            src={currentQuestion.image}
            alt="Асуултын зураг"
            style={{ maxWidth: '100%', marginBottom: '1rem' }}
          />
        )}

        <Card.Text>{currentQuestion.question}</Card.Text>

        <Form>
          {currentQuestion.options.map((option, i) => (
            <Form.Check
              key={i}
              type="radio"
              name="answer"
              label={option}
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

          <div>
            {currentQuestionIndex < filteredQuestions.length - 1 && (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!userAnswers[currentQuestionIndex]}
                className="me-2"
              >
                Дараах
              </Button>
            )}
            <Button variant="danger" onClick={handleFinish}>
              Дуусгах
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default App;
