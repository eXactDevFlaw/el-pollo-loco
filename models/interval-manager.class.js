/**
 * Zentrale Verwaltung aller Intervals im Spiel
 * Ermöglicht das einfache Stoppen aller Animationen und Game-Loops
 */
class IntervalManager {
    /**
     * Speichert alle aktiven Intervals
     * @type {number[]}
     */
    static intervals = [];

    /**
     * Registriert ein neues Interval
     * Ersetzt das normale setInterval()
     * @param {Function} callback - Die auszuführende Funktion
     * @param {number} delay - Verzögerung in Millisekunden
     * @returns {number} Die Interval-ID
     */
    static setInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervals.push(intervalId);
        return intervalId;
    }

    /**
     * Stoppt ein einzelnes Interval
     * @param {number} intervalId - Die ID des zu stoppenden Intervals
     */
    static clearInterval(intervalId) {
        clearInterval(intervalId);
        const index = this.intervals.indexOf(intervalId);
        if (index > -1) {
            this.intervals.splice(index, 1);
        }
    }

    /**
     * Stoppt ALLE registrierten Intervals
     * Wird bei Game Over oder Win aufgerufen
     */
    static clearAllIntervals() {
        this.intervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.intervals = [];
        console.log('All intervals stopped');
    }

    /**
     * Gibt die Anzahl der aktiven Intervals zurück
     * Nützlich für Debugging
     * @returns {number} Anzahl aktiver Intervals
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