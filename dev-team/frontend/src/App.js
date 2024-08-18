import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Root from './components/root';


function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
        
          <Route path="/" element={<Root />} />
          
       
        </Routes>
      </Router>
    </div>
  );
}

export default App;
