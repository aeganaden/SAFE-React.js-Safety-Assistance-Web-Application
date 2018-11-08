import React, { Component } from 'react';
import Particles from 'react-particles-js';
import { particleOption } from './particle';
import LandingPage from './components/LandingPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Particles params={particleOption} style={{ position: 'absolute' }} />
        <LandingPage />
      </div>
    );
  }
}

export default App;
