// Skeleton Loader Component
// Provides loading states for data-heavy views

const SkeletonLoader = {
    // Generate skeleton for dashboard family cards
    dashboardSkeleton: function(count = 6) {
        return Array(count).fill(0).map(() => `
            <div class="family-card skeleton-card">
                <div class="skeleton-header">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-badge"></div>
                </div>
                <div class="skeleton-stats">
                    <div class="skeleton-stat"></div>
                    <div class="skeleton-stat"></div>
                    <div class="skeleton-stat"></div>
                </div>
                <div class="skeleton-progress"></div>
            </div>
        `).join('');
    },

    // Generate skeleton for assessment controls list
    controlsSkeleton: function(count = 5) {
        return Array(count).fill(0).map(() => `
            <div class="control-family skeleton-family">
                <div class="skeleton-family-header">
                    <div class="skeleton-family-title"></div>
                    <div class="skeleton-family-stats"></div>
                </div>
            </div>
        `).join('');
    },

    // Generate skeleton for crosswalk table
    crosswalkSkeleton: function(rows = 10) {
        return `
            <div class="skeleton-table">
                ${Array(rows).fill(0).map(() => `
                    <div class="skeleton-row">
                        <div class="skeleton-cell"></div>
                        <div class="skeleton-cell"></div>
                        <div class="skeleton-cell"></div>
                        <div class="skeleton-cell"></div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Show loading state for a container
    show: function(containerId, type = 'dashboard', count) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let skeleton = '';
        switch(type) {
            case 'dashboard':
                skeleton = this.dashboardSkeleton(count);
                break;
            case 'controls':
                skeleton = this.controlsSkeleton(count);
                break;
            case 'crosswalk':
                skeleton = this.crosswalkSkeleton(count);
                break;
            default:
                skeleton = '<div class="skeleton-generic"></div>';
        }

        container.innerHTML = skeleton;
        container.classList.add('loading');
    },

    // Hide loading state
    hide: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.classList.remove('loading');
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.SkeletonLoader = SkeletonLoader;
}
