import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SprintMode from './components/SprintMode';
import ContestMode from './components/ContestMode';
import SubmissionsMode from './components/SubmissionsMode';
import ProblemsMode from './components/ProblemsMode';
import ProfileMode from './components/ProfileMode';
import ProblemWorkspace from './components/ProblemWorkspace';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { User, ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  // Optional: tracking selected problem ID could be added here if needed for data fetching
  // const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);

  // Mock user data
  const user: User = {
    name: 'Moin Uddin',
    avatar: 'https://picsum.photos/200',
    rank: 1402,
    xp: 24500
  };

  const handleProblemSelect = (id: number) => {
      // setSelectedProblemId(id);
      setCurrentView(ViewState.PROBLEM_WORKSPACE);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard user={user} setViewState={setCurrentView} />;
      case ViewState.SPRINT:
        return <SprintMode />;
      case ViewState.CONTEST:
        return <ContestMode />;
      case ViewState.SUBMISSIONS:
        return <SubmissionsMode />;
      case ViewState.PROBLEMS:
        return <ProblemsMode onSelectProblem={handleProblemSelect} />;
      case ViewState.PROFILE:
        return <ProfileMode user={user} />;
      case ViewState.PROBLEM_WORKSPACE:
        return <ProblemWorkspace onBack={() => setCurrentView(ViewState.PROBLEMS)} />;
      default:
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <div className="text-6xl mb-4 grayscale opacity-20">🚧</div>
                <h2 className="text-xl font-medium mb-2 text-slate-300 font-mono">
                   &lt;WorkInProgress module="{currentView}" /&gt;
                </h2>
                <p className="text-slate-500 text-sm">This system module is currently under development.</p>
                <button 
                    onClick={() => setCurrentView(ViewState.DASHBOARD)}
                    className="mt-6 px-6 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-md text-green-400 transition-all text-xs font-mono uppercase tracking-wider"
                >
                    Return_to_Root
                </button>
            </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen text-slate-200 font-sans selection:bg-green-500/30 selection:text-green-200">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="ml-64 flex-1 flex flex-col min-h-screen relative z-0">
        <Header user={user} />
        
        <div className={`flex-1 overflow-x-hidden ${currentView === ViewState.PROBLEM_WORKSPACE ? 'p-4' : 'p-8'}`}>
          {renderView()}
        </div>
      </main>

      <AIAssistantWidget />
    </div>
  );
};

export default App;