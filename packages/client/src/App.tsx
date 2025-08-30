import ChatBot from './components/chat/Chatbot';
import ProductList from './components/products/ProductList';
import ReviewList from './components/reviews/ReviewList';
import { Routes, Route } from 'react-router';

function App() {
    return (
        <div className="w-screen h-screen">
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route
                    path="/product/:productId/review"
                    element={<ReviewList />}
                />
            </Routes>
        </div>
    );
}

export default App;
