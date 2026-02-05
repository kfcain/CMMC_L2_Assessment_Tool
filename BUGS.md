# Known Bugs and Issues

## Critical Issues to Fix

### 1. Enhancement Module Buttons Not Working
- **Issue**: Implementation Details, Link Evidence, and AI Analyze buttons don't open modals
- **Cause**: Event listeners may not be firing or modals not being created
- **Files**: `js/assessment-enhancements.js`, `js/ai-assistant.js`

### 2. Hamburger Menu Enhancement Buttons
- **Issue**: Enhanced POA&M, Enhanced Planner, Readiness Scorecard buttons may not work
- **Cause**: Event listeners not properly bound or views not rendering
- **Files**: `js/poam-enhancements.js`, `js/planner-enhancements.js`, `js/readiness-scorecard.js`

### 3. Module Initialization Timing
- **Issue**: Enhancement modules load with `defer` but may need access to `window.app`
- **Cause**: Race condition between app-main.js and enhancement modules
- **Files**: `index.html`, all enhancement modules

## Fixes to Implement

1. Ensure all enhancement modules properly check for `window.app` existence
2. Add error handling for missing DOM elements
3. Verify event delegation is working correctly
4. Test all modal creation and display logic
5. Check CSS for modal visibility issues

## Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Hamburger menu opens/closes
- [ ] All hamburger menu buttons work
- [ ] Implementation Details button opens modal
- [ ] Link Evidence button opens modal
- [ ] AI Analyze button opens modal (or shows config prompt)
- [ ] Enhanced POA&M view loads
- [ ] Enhanced Planner view loads
- [ ] Readiness Scorecard view loads
- [ ] System Inventory opens
- [ ] AI Settings modal opens
