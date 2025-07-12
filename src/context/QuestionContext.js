import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const QuestionContext = createContext();

const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ sort: 'newest', unanswered: false, search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/questions', {
        params: {
          sort: filters.sort,
          unanswered: filters.unanswered,
          search: filters.search,
          page,
        },
      });
      setQuestions(res.data.questions);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters, page]);

  return (
    <QuestionContext.Provider
      value={{
        questions,
        loading,
        error,
        page,
        setPage,
        totalPages,
        filters,
        setFilters,
        refetch: fetchQuestions,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;