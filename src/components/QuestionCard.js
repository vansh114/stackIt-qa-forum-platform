import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>
                    <Link to={`/question/${question._id}`}>{question.title}</Link>
                </Card.Title>
                <Card.Text className="text-truncate">{question.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                        {question.tags.map((tag, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <small className="text-muted">
                        {question.answers?.length || 0} answers • by @{question.askedBy?.username}
                    </small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default QuestionCard;