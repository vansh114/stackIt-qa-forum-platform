import React, { useContext } from 'react';
import { Container, Spinner, Alert, Row } from 'react-bootstrap';
import { QuestionContext } from '../context/QuestionContext';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';

const Home = () => {
    const {
        questions,
        loading,
        error,
        page,
        setPage,
        totalPages,
    } = useContext(QuestionContext);

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Top Questions</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : questions.length === 0 ? (
                <Alert variant="info">No questions found.</Alert>
            ) : (
                <>
                    {questions.map((question) => (
                        <QuestionCard key={question._id} question={question} />
                    ))}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(num) => setPage(num)}
                    />
                </>
            )}
        </Container>
    );
};

export default Home;