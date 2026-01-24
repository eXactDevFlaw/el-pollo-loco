/**
 * Central management of all intervals in the game
 */
class IntervalManager {
    static intervals = [];

    /**
     * Registers a new interval
     * @param {Function} callback - The function to execute
     * @param {number} delay - Delay in milliseconds
     * @returns {number} The interval ID
     */
    static setInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervals.push(intervalId);
        return intervalId;
    }

    /**
     * Stops a single interval
     * @param {number} intervalId - ID of interval to stop
     */
    static clearInterval(intervalId) {
        clearInterval(intervalId);
        const index = this.intervals.indexOf(intervalId);
        if (index > -1) {
            this.intervals.splice(index, 1);
        }
    }

    /**
     * Stops all registered intervals
     */
    static clearAllIntervals() {
        this.intervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.intervals = [];
    }

    /**
     * Returns number of active intervals
     * @returns {number} Number of active intervals
     */
    static getActiveCount() {
        return this.intervals.length;
    }
}

window.setStoppableInterval = (callback, delay) => {
    return IntervalManager.setInterval(callback, delay);
};

window.stopAllIntervals = () => {
    IntervalManager.clearAllIntervals();
};