// Minimal Implementation Planner for testing
const IMPLEMENTATION_PLANNER = {
    version: "2.0.0",
    title: "CMMC Implementation Planner - Test Version",
    description: "Minimal version for testing",
    
    phases: [
        {
            id: "phase-1",
            name: "Test Phase",
            description: "Test phase for debugging",
            duration: "1 week",
            icon: "foundation",
            color: "#61afef",
            milestones: [
                {
                    id: "m1-1",
                    name: "Test Milestone",
                    description: "Test milestone",
                    tasks: [
                        {
                            id: "t1-1-1",
                            name: "Test Task",
                            description: "Test task description",
                            controls: ["3.1.1"],
                            priority: "medium",
                            effort: "low"
                        }
                    ]
                }
            ]
        }
    ]
};

console.log('Minimal implementation planner loaded successfully');

// Expose globally
if (typeof window !== 'undefined') {
    window.IMPLEMENTATION_PLANNER = IMPLEMENTATION_PLANNER;
    console.log('IMPLEMENTATION_PLANNER exposed globally');
}
