import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { WorldView } from './components/WorldView';
import { AgentPanel } from './components/AgentPanel';
import './App.css';

function App() {
  const [selectedAgent, setSelectedAgent] = useState<string>('agent_001');

  return (
    <Provider store={store}>
      <div className="app">
        <div className="main-view">
          <WorldView 
            width={window.innerWidth * 0.7} 
            height={window.innerHeight}
            onAgentClick={setSelectedAgent}
          />
        </div>
        <div className="side-panel">
          <h1>SentientCities</h1>
          <div className="agent-selector">
            <button onClick={() => setSelectedAgent('agent_001')}>Alice</button>
            <button onClick={() => setSelectedAgent('agent_002')}>Bob</button>
          </div>
          {selectedAgent && <AgentPanel agentId={selectedAgent} />}
        </div>
      </div>
    </Provider>
  );
}

export default App;